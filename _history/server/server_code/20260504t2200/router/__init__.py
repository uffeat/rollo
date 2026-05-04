import base64
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

UTF_8 = "utf-8"


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
                path = path[:-len('.html')]
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
        
        # Prepare form kwargs
        kwargs = dict(
            page=page,
            parts=parts,
            path=path,
            query=query,
            session_id=session_id,
            targets=targets,
        )
        # Handle data
        if 'data' in query:
            data = query.pop("data")
            if isinstance(data, str):
                if data.startswith('[') or data.startswith('{'):
                    try:
                        data = json.loads(data)
                    except:
                        pass
                else:
                    try:
                        data = base64.b64decode(data).decode(encoding=UTF_8)
                    except:
                        pass
                    try:
                        data = json.loads(data)
                    except:
                        pass
            kwargs.update(data=data)
        # Add test flag, if True -> if not True, form decides
        if meta.DEV and test:
            kwargs.update(test=test)
        # Check if form needs template
        template = spec.get("template")
        if template:
            # Get form template
            template = get_asset_text(template, test=test)
            if template.endswith(".jinja"):
                template = render(template, **query)
            kwargs.update(template=template)
        # Extract caller origin
        if meta.DEV and access():
            # HACK Useful to allow caller to declare its own origin (insecure -> require access)
            kwargs.update(origin=query.pop("origin", None))
        return FormResponse(page, **kwargs)
    except:
        # Last line of defense
        return View(
            "error/error.jinja",
            data=dict(
                message=f'Error: <p class="fs-3 text-danger">{traceback.format_exc()}</p>'
            ),
        )
