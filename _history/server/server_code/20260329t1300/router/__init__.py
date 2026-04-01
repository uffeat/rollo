import traceback
from anvil.server import FormResponse
from ..main import targets
from ..tools import log, session_id
from ._factory import create_routes
from ._pages import START, pages, redirects
from ._query import parse
from ._view import View


class router:
    # Keep as class for future extensions

    def __call__(self, **query):
        # Parse kwargs
        page, path, query = parse(START, query)
        # Redirect
        page = redirects.get(page, page)
        # Get spec
        spec = pages.get(page)
        # Check page
        if page not in pages:
            return View(
                "templates/errors/error.jinja",
                message=f"Invalid page: {page}",
            )
        
        # Check requirements
        if not pages[page].get("require", lambda: True)():
            return View(
                "templates/errors/error.jinja",
                message=f"No access to {page}",
            )
        # Route
        try:
            # Check if view
            view = pages[page].get("view")
            if view:
                return View(view, query=query)
            return FormResponse(
                page,
                origin=query.pop("origin", None),
                page=page,
                path=path,
                session_id=session_id,
                targets=targets,
                **query,
            )
        except:
            # Last line of defense
            return View(
                "errors/error",
                message=f'Error: <p class="fs-3 text-danger">{traceback.format_exc()}</p>',
            )


create_routes(router())
