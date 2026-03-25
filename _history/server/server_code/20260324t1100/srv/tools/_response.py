from anvil.server import HttpResponse

CHARSET = "; charset=utf-8"

types = {
    "css": "text/css",
    "html": f"text/html{CHARSET}",
    "js": f"text/javascript{CHARSET}",
    "json": f"application/json{CHARSET}",
    "text": f"text/plain{CHARSET}",
}


def Response(
    body=None, content_type: str = "json", cors: bool = False, status: int = 200
) -> HttpResponse:
    """Returns http response with basic config."""
    http_response = HttpResponse(status=status)
    # Set CORS
    if cors:
        http_response.headers["access-control-allow-origin"] = "*"
    # Set content type
    if content_type:
        http_response.headers["content-type"] = types.get(content_type, content_type)
    if body:
        http_response.body = body

    return http_response
