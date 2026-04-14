import json
from anvil import BlobMedia
from tools import Api, db


class echo(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):
        print("args:", args)
        print("kwargs:", kwargs)
        print("meta:", self.meta)
        return 'POW!'
        if len(args) == 1 and not kwargs:
            return args[0]
        if args and not kwargs:
            return args
        if not args and kwargs:
            return kwargs
        if args and kwargs:
            return args, kwargs


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

    cls = echo

    @rpc
    def echo(*args, _meta: dict = None, **kwargs):
        instance = cls(meta=_meta)
        result = instance(*args, **kwargs)
        return result, _meta

    print("Running local server to serve target.")
    # HACK Script sometimes fails at first run
    try:
        wait_forever()
    except:
        wait_forever()
