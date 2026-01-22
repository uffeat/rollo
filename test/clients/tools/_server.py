import json
import anvil.server as _server


class submission:
    def __init__(self):
        self._submission = 0

    def __call__(self) -> int:
        result = self._submission
        self._submission + 1
        return result

    @property
    def submission(self) -> int:
        return self._submission


submission = submission()


class rpc:
    """Util for calling server functions."""

    def __getattr__(self, name: str) -> callable:
        return self[name]

    def __getitem__(self, name: str) -> callable:

        def wrapper(*args, **kwargs):
            # Package target arguments into request
            request = dict(args=args, kwargs=kwargs)
            response = _server.call(
                name,
                request=request,
                submission=submission(),
            )
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

        return wrapper

    @property
    def submission(self):
        return submission.submission


rpc = rpc()
