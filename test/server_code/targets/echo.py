import json
from pathlib import Path
from anvil.server import (
    callable as rpc,
    connect,
    wait_forever,
)

UTF_8 = "utf-8"
TESTS = "test/server_code/tests"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
    "development"
]["server"]



class target:
    def __init__(self, *args, **kwargs):
        """."""


    def __call__(self, *args, **kwargs):
        """."""
        




def main():

    # XXX TODO Refactor to args=aargs etc.

    @rpc
    def echo(*args, _meta: dict=None, **kwargs):
        print("args:", args)
        print("_meta:", _meta)
        print("kwargs:", kwargs)
        return 'POW!'


if __name__ == "__main__":
    connect(KEY)
    main()
    print("Running local server to serve test target.")
    # HACK For some reason, this script fails at first run (probably an Anvil bug)
    try:
        wait_forever()
    except:
        wait_forever()
   
