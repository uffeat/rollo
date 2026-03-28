import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    callable as rpc,
    connect,
    http_endpoint,
    wait_forever,
)

UTF_8 = "utf-8"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
    "development"
]["server"]
ASSETS = "test/assets"


def main():

    @rpc
    def _assets(path: str):
        return (Path.cwd() / f"{ASSETS}/{path}").read_text(encoding=UTF_8)


if __name__ == "__main__":
    connect(KEY)
    main()
    print("Running local server for asset injection.")
    # HACK For some reason, this script fails at first run (probably an Anvil bug)
    try:
        wait_forever()
    except:
        wait_forever()
