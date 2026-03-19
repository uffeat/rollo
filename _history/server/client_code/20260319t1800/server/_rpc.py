import json
import anvil.server as server
from ..window import window
from ._submission import Submission


# XXX Perhaps optional conversion of data to blob
# XXX Perhaps auto-conversion of native files to media
# XXX Perhaps add 'schema' for type meta


class rpc:
    def __init__(self):

        def call(*args, **kwargs):
            """Calls server without spinner."""
            with server.no_loading_indicator:
                return server.call(*args, **kwargs)

        self._ = dict(call=call)

    def __call__(
        self,
        name: str,
        args: list = None,
        callback: callable = None,
        kwargs: dict = None,
        spinner: bool = False,
        state: dict = None,
        test: bool = False,
        **query
    ):
        # Set call function: With or without spinner
        call = server.call if spinner else self._["call"]
        # Package target arguments and state into data
        data = dict(args=args or [], kwargs=kwargs or {}, state=state or {})

        # Wrap server call to enable session recovery
        def get_response():
            """Calls server."""
            args = ["main", name]
            kwargs = dict(data=data, submission=Submission(), test=test, **query)
            if callback:
                window.setTimeout(lambda: callback(call(*args, **kwargs)), 0)
            else:
                return call(*args, **kwargs)

        # Handle session recovery
        try:
            response = get_response()
        except server.SessionExpiredError:
            # Recover from expired session
            server.reset_session()
            response = get_response()
        # Check if response is a blob
        if hasattr(response, "get_bytes"):
            meta = json.loads(response.name)
            decoded = response.get_bytes().decode("utf-8")
            result = json.loads(decoded)
            return dict(result=result, meta=meta)
        # Check if error response (always dict)
        if isinstance(response, dict) and "__error__" in response:
            raise Exception(response["__error__"])
        # Non-error dict response
        return response

    def __getattr__(self, name: str) -> callable:
        return self[name]

    def __getitem__(self, name: str) -> callable:
        """Returns callable that calls a specific server function."""
        owner = self
        _ = {}

        # Mutable as an alternative to using 'global'
        _callback = {}

        class then:
            """Callback decorator for non-blocking server calls."""
            def __init__(self, *args, **kwargs):
                self.args, self.kwargs = args, kwargs

            def __call__(self, callback: callable) -> callable:
                _callback["callback"] = callback
                # Params in decorator -> run immediately
                if self.args or self.kwargs:
                    owner(
                        name, args=self.args, callback=callback, kwargs=self.kwargs, **_
                    )
                return callback

        class caller:

            def __call__(self, *args, **kwargs):
                return owner(
                    name,
                    args=args,
                    callback=_callback.get("callback"),
                    kwargs=kwargs,
                    **_
                )

            def __getitem__(self, key: str):
                return _[key]

            def __getattr__(self, key: str):
                return self[key]

            @property
            def then(self) -> type:
                """Decorates callback."""
                return then

            @then.setter
            def then(self, callback: callable):
                """Sets callback."""
                _["callback"] = callback

            def setup(self, **updates):
                """Configures server call."""
                _.update(updates)
                return self

        return caller()


rpc = rpc()
