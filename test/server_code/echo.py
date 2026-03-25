from tools import Api


class echo(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


    def __call__(self, *args, **kwargs):
        print('args:', args)
        print('kwargs:', kwargs)
        print('meta:', self.meta)
        self.meta['detail'].update(dict(echo_detail=42))
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
    def echo(*args, _meta: dict=None, **kwargs):
        instance = Echo(meta=_meta)
        result = instance(*args, **kwargs)
        return result, _meta
    
    

    print("Running local server to serve target.")
    # HACK For some reason, this script fails at first run (probably an Anvil bug)
    try:
        wait_forever()
    except:
        wait_forever()
