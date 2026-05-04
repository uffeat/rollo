from ..tools import (
    Query,
    Response,
    api,
    get_asset,
    get_asset_text,
    log,
)


@api(type='api')
def assets(path: str, *args, parts: list=None, **query):
    """Exposes public asset."""
    # Parse query
    query = Query(query)
    # Extract test flag
    test = query.pop("test", False)
    cors = path.startswith('public')
    if test:
        text = get_asset_text(f"public{path}", test=test)
        return Response(body=text, content_type="auto", cors=cors)
    return Response(body=get_asset(f"public{path}"), content_type="auto", cors=cors)
