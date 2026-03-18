import json
from pathlib import Path
from anvil.server import (
    callable as rpc,
    connect,
    disconnect,
    wait_forever,
)

UTF_8 = "utf-8"
TESTS = "test/server_code/tests"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
    "development"
]["server"]


def main():

    @rpc
    def _get_api_text(name: str):
        text = (Path.cwd() / f"{TESTS}/{name}.py").read_text(encoding=UTF_8)
        return text


if __name__ == "__main__":
    ##disconnect()
    connect(KEY)
    main()
    print("Running local server for server endpoint injection.")
    # HACK For some reason, this script fails at first run (probably an Anvil bug)
    try:
        wait_forever()
    except:
        wait_forever()
   
