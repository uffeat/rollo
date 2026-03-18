import json
from pathlib import Path
from anvil.server import (
    callable as rpc,
    connect,
    wait_forever,
)

UTF_8 = "utf-8"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
    "development"
]["server"]

PACKAGES = "test/client_code/packages"


def main():

    @rpc
    def _package(name: str):
        return (Path.cwd() / f"{PACKAGES}/{name}.py").read_text(encoding=UTF_8)


if __name__ == "__main__":
    connect(KEY)
    main()
    print("Running local server for client-code package injection.")
    wait_forever()
