from anvil import Media
from .tools import Api, Blob



class bar(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, data: Media=None, **kwargs):
        return Blob(data).read()
