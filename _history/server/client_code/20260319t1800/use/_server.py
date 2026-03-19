from ..server import rpc
from ._assets import assets, compose, source


@source("api")
def handler(path=None, **kwargs):
    server = assets.get("@/server").server
    # HACK Typeless imports default to js, however 'stem' does not convey type.
    name = path.stem

    def caller(*args, **kwargs):
        response = server[name](kwargs, *args)
        return dict(result=response["result"], meta=response["meta"])

    return caller


@source("rpc")
def handler(path=None, *args, **kwargs):
    # HACK Typeless imports default to js, however 'stem' does not convey type.
    name = path.stem
    options = dict(kwargs.get("options", {}))
    caller = rpc[name]
    return caller.setup(**options)


def rpc_handler(*args, **kwargs):
    print("args", args)  ##
    print("kwargs", kwargs)  ##


assets.sources.add("rpc", rpc_handler)
