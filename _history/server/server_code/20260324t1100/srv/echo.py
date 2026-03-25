from .tools import Api, api, log


@api()
class echo(Api):
    """NOTE For verification."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):
        return args, kwargs

