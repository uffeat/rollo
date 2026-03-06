import json
import anvil.server as server
from ._assets import assets, source



Submission = assets.get("@/server").Submission



class rpc:
    def __init__(self):
        self._ = {}

    def __getattr__(self, name: str) -> callable:
        return self[name]

    def __getitem__(self, name: str) -> callable:

        def wrapper(spinner: bool = False) -> callable:
            if spinner:
                call = server.call
            else:

                def call(*args, **kwargs):
                    with server.no_loading_indicator:
                        return server.call(*args, **kwargs)

            def caller(*args, **kwargs):
                # Package target arguments into data
                data = dict(args=args, kwargs=kwargs)
                # Call server
                def get_response():
                    return call(
                        "main",
                        name,
                        data=data,
                        session=assets.meta.session,
                        submission=Submission(),
                        token=assets.meta.token,
                    )

                try:
                    response = get_response()
                except server.SessionExpiredError:
                    # Recover from expired session
                    server.reset_session()
                    response = get_response()

                # Check if response is a blob. Since default, do first.
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

            return caller

        return wrapper

    

rpc = rpc()

# TODO api singleton with same ergonomics as rpc and session recovery. Add api to (Py) use as prop


@source("api")
def handler(path=None, **kwargs):
    server = assets.get("@/server").server
    # HACK Typeless imports default to js, however 'stem' does not convey type.
    name = path.stem

    def caller(*args, **kwargs):
        response = server[name](kwargs, *args)
        return dict(result=response['result'], meta=response['meta'])

    return caller


@source("rpc")
def handler(path=None, **kwargs):
    options = dict(kwargs.get("options", {}))
    spinner = options.get("spinner")
    # HACK Typeless imports default to js, however 'stem' does not convey type.
    name = path.stem
    caller = rpc[name](spinner=spinner)
    return caller
