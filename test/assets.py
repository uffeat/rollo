"""Serves server app injected assets."""

from pathlib import Path
from anvil.server import HttpResponse, http_endpoint
from server_code.tools import connect, server_function

ASSETS = "test/assets"
UTF_8 = "utf-8"


keep = connect()


@http_endpoint("/_assets")
def _assets(path: str = None):
    body = (Path.cwd() / f"{ASSETS}/{path}").read_text(encoding=UTF_8)
    return HttpResponse(
        body=body,
        headers={
            "access-control-allow-origin": "*",
        },
    )


@server_function
def _assets(path: str):
    return (Path.cwd() / f"{ASSETS}/{path}").read_text(encoding=UTF_8)


keep("Running local server for asset injection.")
