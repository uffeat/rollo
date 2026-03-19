import json
import anvil.server as server
from ._submission import Submission


class api:
    def __init__(self):
        """."""

        def call(*args, **kwargs):
            with server.no_loading_indicator:
                return server.call(*args, **kwargs)

        self._ = dict(call=call)

    def __call__(
        self,
        name: str,
        args: list = None,
        kwargs: dict = None,
        spinner: bool = False,
        state: dict = None,
    ):
        """."""
        # TODO
        

    def __getattr__(self, name) -> callable:
        return self[name]

    def __getitem__(self, name: str) -> callable:
        owner = self
        _ = {}

        class wrapper:
            
            def __call__(self, *args, **kwargs):
                return owner(
                    name,
                    args=args,
                    kwargs=kwargs,
                    spinner=_.get("spinner"),
                    state=_.get("state"),
                )
            
            def __getitem__(self, key):
                return _[key]

            def __getattr__(self, key):
                return self[key]
            
            def __setitem__(self, key, value):
                _[key] = value

            def __setattr__(self, key, value):
                self[key] = value

        wrapper = wrapper()

        return wrapper


api = api()
