import json
import traceback
from anvil.server import FormResponse
from ..tools import (
    Query,
    Response,
    access,
    api,
    meta,
    get_asset,
    get_asset_text,
    log,
    registry,
    render,
    session_id,
)
from ._manifest import manifest
from ._pages import START, pages, redirects, rewrites
from ._view import View


@api("/")
def router(path: str, *args, parts: list = None, **query):
    # NOTE 'path' always starts with '/'
    targets = tuple(registry.keys())
    # Extract page
    page = next(iter(parts), START)
    # Parse query
    query: dict = Query(query)
    # Extract test flag
    test = query.pop("test", False)
    # Redirect
    page = redirects.get(page, page)
    # Rewrite
    path = rewrites.get(path, path)
    # Route
    try:
        # Check page
        if page not in pages:
            # Undeclared page -> default to static html
            path = path[1:]
            if not path.endswith(".html"):
                path = f"{path}.html"
            if path not in manifest:
                return View(
                    "error/error.jinja",
                    data=dict(message=f"Invalid path: {path}"),
                )
            if meta.DEV and test:
                return Response(
                    body=get_asset_text(path, test=test), content_type="html", cors=True
                )
            return get_asset(path)
        # Declared page
        spec = pages.get(page)
        # Check requirements
        if not spec.get("require", lambda: True)():
            return View("error/error.jinja", data=dict(message=f"No access to {page}"))
        # Check if view
        view = spec.get("view")
        if view:
            # View response
            # XXX Could test against manifest, but rely on declaration
            return View(
                view,
                test,
                data=dict(
                    meta=json.dumps(
                        dict(server=dict(session_id=session_id, targets=targets))
                    ),
                    query=json.dumps(query),
                ),
            )
        # Form response
        data = dict(
            caller="server",
            page=page,
            parts=parts,
            path=path,
            query=query,
            session_id=session_id,
            test=test,
            targets=targets,
        )
        # Check if form needs template
        template = spec.get("template")
        if template:
            # Get form template
            template = get_asset_text(template, test=test)
            if template.endswith(".jinja"):
                template = render(template, **query)
            data.update(template=template)

        # Extract caller origin
        if meta.DEV and access():
            # HACK Useful to allow caller to declare its own origin (insecure -> require access)
            data.update(origin=query.pop("origin", None))
        return FormResponse(page, **data)
    except:
        # Last line of defense
        return View(
            "error/error.jinja",
            data=dict(
                message=f'Error: <p class="fs-3 text-danger">{traceback.format_exc()}</p>'
            ),
        )
