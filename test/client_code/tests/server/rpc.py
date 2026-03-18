"""
server/rpc.py
"""

def main(use, *args, **kwargs):
    """."""
    import json
    import anvil.server as server

    _state: dict = kwargs['state']
    submission = _state.get('submission', -1)
    _state['submission'] = submission + 1



    print("Using injected server package")

    


        
    class rpc:
        def __init__(self):

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
            call = server.call if spinner else self._["call"]

            # Package target arguments into data
            data = dict(args=args or [], kwargs=kwargs or {}, state=state or {})

            # XXX Consider converting data to blob

            # Call server
            def get_response():
                return call(
                    "main",
                    name,
                    data=data,
                    submission=submission,
                )

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

        def __getattr__(self, name) -> callable:
            return self[name]

        def __getitem__(self, name: str) -> callable:
            owner = self
            _ = {}

            class caller:

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

                def setup(self, **updates):
                    _.update(updates)
                    return self

            caller = caller()

            return caller


    rpc = rpc()

    result = rpc.echo(1, 2, 3)
    print('result:', result)

    