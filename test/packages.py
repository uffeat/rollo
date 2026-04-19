from pathlib import Path
from server_code.tools import connect, server_function

ASSETS = "test/assets"
PACKAGES = "test/client_code/packages"
UTF_8 = "utf-8"


keep = connect()




@server_function
def _package(name: str):
    return (Path.cwd() / f"{PACKAGES}/{name}/{name}.py").read_text(encoding=UTF_8)


keep("Running local server for client-code package injection.")
