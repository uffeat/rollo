from tools import api, rpc


@api()
@rpc()
class echo:
    """NOTE For verification."""
    def __call__(self, *args, meta=None, raw=None, **kwargs):
        return [kwargs, args]
