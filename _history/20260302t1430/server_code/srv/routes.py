from anvil.server import FormResponse, route, get_session_id, request
from .tools import DEV, access, api


def convert(v):
    """Converts value of query item."""
    if v is None or v == "" or v == "true":
        return True
    if v == "false":
        return False
    try:
        return int(v)
    except:
        return v


def main(**kwargs):
    """Universal router."""

    
    if not access():
        return



    paths = [v for k, v in kwargs.items() if k.startswith("_") and len(k) == 2]
    page = paths[0] if paths else "main"
    path = f"/{'/'.join(paths)}"
    query = {
        k: convert(v) for k, v in kwargs.items() if not k.startswith("_") and len(k) > 2
    }

    ##request_origin = request.origin
    request_origin = request.headers.get("origin")


    props = dict(
        origin=request_origin,
        page=page,
        path=path,
        query=query,
        session=get_session_id(),
        targets=list(api.registry.keys()),
    )

    if DEV:
        if page == "test":
            return FormResponse(page, **props)
        
    if page == "blog":
        return FormResponse(page, **props)
    
    if page == "iworker":
        return FormResponse(page, **props)
    
    if page == "login":
        return FormResponse(page, **props)

    return FormResponse("main", **props)


# Allow arbitrary path parts until depth level 4
route("/", methods=["GET"])(main)
for index in range(4):
    route(("").join([f"/:_{i}" for i in range(index)]), methods=["GET"])(main)
