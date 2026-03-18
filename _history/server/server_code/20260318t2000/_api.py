import json
import traceback
from anvil.server import request
from ..tools import Date, Response, access, api, log, meta


class Api:
    """Single-point http endpoint that delegates to class-based targets by name.
    Intended for fast zero-preflight client-server coms.
    TODO
    - Allow blob responses with automatic detection based of target result
      type-checking or explicit declaration via options.
      Will require smart detection client-side, perhaps based on type-checking,
      perhaps based on (custom?) response headers.
    """

    def __init__(self):
        self._ = {}

    def __call__(self, name="", submission=None, **query):
        """Single-point api that delegates to targets by name."""
        # Set submission
        submission = None if submission is None else int(submission)
        # Allow injection of test target from local uplink server
        # TO:DO
        # Prepare http_response
        response = Response()
        # Inspect origin
        origin = request.headers.get("origin")
        if not origin:
            return Response(status=403)
        same_origin = meta.origin == origin
        # Prepare meta
        self._["meta"] = dict(
            env=meta.env,
            name=name,
            origin=origin,
            same_origin=same_origin,
            submission=submission,
            time={"in": Date.now()()},
            type="api",
        )
        # Control access
        if same_origin:
            response.headers["access-control-allow-origin"] = origin
        else:
            if meta.PROD:
                if origin == meta.client.origin:
                    response.headers["access-control-allow-origin"] = origin
                else:
                    return Response(status=403)
            else:
                # NOTE In DEV, a local server must run to provide access.
                if access():
                    response.headers["access-control-allow-origin"] = origin
                else:
                    return Response(status=403)
        # Retrieve registered
        if name not in api.registry:
            return Response(status=401)
        registered = api.registry[name]
        target, options = registered["target"], registered["options"]
        # Get request data
        raw = options.get("raw")
        if raw:
            # raw option -> No need to read request body
            data = request.body
        else:
            data: dict = json.loads(request.body.get_bytes().decode("utf-8")).pop(
                "data", {}
            )
            args, kwargs, _state = (
                data.get("args", []),
                data.get("kwargs", {}),
                data.get("state", {}),
            )
        # Create response from target result
        try:
            # Create instance
            if "__init__" in target.__dict__:
                instance = target(
                    meta=self.meta,
                )
            else:
                instance = target()
            # Get result
            if raw:
                result = instance(data=data)
            else:
                result = instance(*args, **kwargs)
            if callable(result):
                result = result()
            _response = dict(result=result, meta=self.meta)
        except:
            """NOTE MUCH better than bland status codes! Use 'ok' etc.
            convention inside result for soft validation signal."""
            _response = dict(__error__=traceback.format_exc(), meta=self.meta)
        # Add exit time to meta
        self.meta["time"]["out"] = Date.now()()
        response.body = json.dumps(_response)
        return response

    def __getitem__(self, key: str):
        return self._.get(key)

    def __getattr__(self, key: str):
        return self._[key]
