from anvil import Media
from .tools import Api, Blob, api


@api(raw=True)
class bar(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, data: Media=None):
        return Blob(data).read()
