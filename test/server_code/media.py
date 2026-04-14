import json
from anvil import BlobMedia
from tools import Api, db


class media(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, name:str=None, **kwargs):
        row = db.media.get(name=name)
        result = row["media"]
        return result

       


if __name__ == "__main__":
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
    connect(KEY)

    cls = media

    @rpc
    def media(*args, _meta: dict = None, **kwargs):
        instance = cls(meta=_meta)
        result = instance(*args, **kwargs)
        return result, _meta

    print("Running local server to serve target.")
    # HACK Script sometimes fails at first run
    try:
        wait_forever()
    except:
        wait_forever()
