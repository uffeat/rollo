from pathlib import Path
from anvil.server import HttpResponse, http_endpoint
from server_code.tools import connect, server_function

SOURCE = "test/client_code/dev"
UTF_8 = "utf-8"

keep = connect()


@server_function
def _dev(path: str):
    return (Path.cwd() / f"{SOURCE}{path}").read_text(encoding=UTF_8)


keep("Running local server for client-code dev.")
