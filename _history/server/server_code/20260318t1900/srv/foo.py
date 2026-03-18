from anvil import BlobMedia
from .tools import Api, Result, api


@api(returns=BlobMedia)
class foo(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self):
        """XXX For testing."""
        result = Result(foo="FOO")
        result.bar = "BAR"
        result(things=[1, 2, 3])
        return result
