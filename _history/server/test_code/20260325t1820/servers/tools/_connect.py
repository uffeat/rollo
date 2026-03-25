import json
from pathlib import Path
from anvil.server import callable as callable_, connect as _connect, wait_forever

from ._bootstrap import bootstrap



def connect(scope="server"):

    _connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
            "development"
        ][scope]
    )

    if scope == "server":
        bootstrap()

        from server_code.srv import main

        return wait_forever
