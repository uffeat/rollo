import json
from pathlib import Path
from anvil.server import connect as _connect


from ._bootstrap import bootstrap


def connect(scope="client"):

    _connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
            "development"
        ][scope]
    )
