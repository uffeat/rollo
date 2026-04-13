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

        ##self.meta["detail"].update(dict(url=True))
        row = db.media.get(name="handle")
        result = row["media"]

        result = BlobMedia('img/jpg', result.get_bytes())



        return result

        text = result.get_bytes().decode('latin-1')
        print("text", text)  ##
        return text
        ##result = result.url

        print("result:", result)  ##

        return result
        return "POW!"


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

    Echo = echo

    @rpc
    def echo(*args, _meta: dict = None, **kwargs):
        instance = Echo(meta=_meta)
        result = instance(*args, **kwargs)
        return result, _meta

    print("Running local server to serve target.")
    # HACK Script sometimes fails at first run
    try:
        wait_forever()
    except:
        wait_forever()
