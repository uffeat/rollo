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


def main():

    @rpc
    def _log(*args):
        print(*args)


if __name__ == "__main__":
    connect(KEY)
    main()
    print("Running local server for logging.")
    # HACK Script sometimes fails at first run
    try:
        wait_forever()
    except:
        wait_forever()
