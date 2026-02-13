from anvil.server import HttpResponse


content_types = {
    "json": "application/json; charset=utf-8",
    "text": "text/plain; charset=utf-8",
}


def Response(
    content_type: str = "json", cors: bool = False, status: int = 200
) -> HttpResponse:
    """Returns http response with basic config."""
    http_response = HttpResponse(status=status)
    if cors is False:
        http_response.headers["access-control-allow-origin"] = "*"
    if content_type in content_types:
        http_response.headers["content-type"] = content_types[content_type]
    else:
        http_response.headers["content-type"] = content_type
    return http_response
