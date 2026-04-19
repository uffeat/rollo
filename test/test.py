from pathlib import Path
from anvil.server import HttpResponse, http_endpoint
from server_code.tools import connect, server_function



TESTS = "test/client_code/tests"
UTF_8 = "utf-8"

keep = connect()


@http_endpoint("/_test")
def test(path: str = None):
    body = (Path.cwd() / f"{TESTS}/{path}").read_text(encoding=UTF_8)
    return HttpResponse(
        body=body,
        headers={
            "access-control-allow-origin": "*",
        },
    )

@server_function
def _test(path: str):
    return (Path.cwd() / f"{TESTS}/{path}").read_text(encoding=UTF_8)


keep("Running local server for 'test' client-code package.")