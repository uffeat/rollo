from datetime import datetime, timedelta, timezone
import json
import traceback
import uuid
from anvil import BlobMedia
from anvil.server import (
    call,
    callable as rpc,
    context,
    get_app_origin,
    http_endpoint,
    request,
)
from ..tools import (
    Api,
    DEV,
    PROD,
    Response,
    access,
    api,
    env,
    log,
)


class Main:
    """Single-point http endpoint that delegates to class-based targets by name.
    Intended for fast zero-preflight client-server coms.
    TODO
    - Allow blob responses with automatic detection based of target result
      type-checking or explicit declaration via options.
      Will require smart detection client-side, perhaps based on type-checking,
      perhaps based on (custom?) response headers.
    """

    def __init__(self):
        self._ = dict(
            allowed_origins=set(
                ["https://rolloh.vercel.app", "https://fastapilab.onrender.com"]
            )
        )

    def __call__(self, name="", submission=None, **query):
        """Single-point api that delegates to targets by name."""
        log("API context.client.type:", context.client.type)  ## http
        # Set submission
        self._["submission"] = None if submission is None else int(submission)
        # Allow injection of test target from local uplink server
        self.test(name)
        # Prepare http_response
        response = Response()
        # Inspect origin
        origin = request.headers.get("origin")
        if not origin:
            return Response(status=403)
        # Prepare meta
        self._["meta"] = dict(
            env=env,
            name=name,
            origin=origin,
            same_origin=get_app_origin() == origin,
            submission=self.submission,
            sub_session=query.get("session", f"server-{str(uuid.uuid4())}"),
            time={"in": datetime.now(timezone.utc).isoformat()},
            token=query.get("token", f"server-{str(uuid.uuid4())}"),
            type=self.type,
        )
        # Control access
        if self.meta.get("same_origin"):
            response.headers["access-control-allow-origin"] = origin
        else:
            if PROD:
                if origin in self._.get("allowed_origins", set()):
                    response.headers["access-control-allow-origin"] = origin
                else:
                    return Response(status=403)
            else:
                # NOTE In DEV, a local server must run to provide access.
                if access():
                    response.headers["access-control-allow-origin"] = origin
                else:
                    return Response(status=403)
        # Setup state
        state = self.state()
        # Retrieve registered
        if name not in api.registry:
            return Response(status=401)
        registered = api.registry[name]
        target, options = registered["target"], registered["options"]
        # Create response from target result
        try:
            if "__init__" in target.__dict__:
                instance = target(meta=self.meta, owner=self, state=state)
            else:
                instance = target()
            if options.get("raw"):
                # raw option -> No need to read request body
                result = instance(data=request.body)
            else:
                data: dict = json.loads(request.body.get_bytes().decode("utf-8")).pop(
                    "data", {}
                )
                args, kwargs = data.get("args", []), data.get("kwargs", {})
                result = instance(*args, **kwargs)
            if callable(result):
                result = result()
            _response = dict(result=result, meta=self.meta)
        except:
            """NOTE MUCH better than bland status codes! Use 'ok' etc.
            convention inside result for soft validation signal."""
            _response = dict(__error__=traceback.format_exc(), meta=self.meta)

        self.meta["time"]["out"] = datetime.now(timezone.utc).isoformat()
        response.body = json.dumps(_response)
        return response

    @property
    def context(self):
        """browser, server_module, uplink."""
        return context.type

    @property
    def ip(self):
        return context.client.ip

    @property
    def location(self):
        if not self._.get("location"):
            self._["location"] = (
                dict(
                    city=context.client.location.city,
                    country=context.client.location.country,
                    latitude=context.client.location.latitude,
                    longitude=context.client.location.longitude,
                )
                if context.client.location
                else {}
            )
        return self._["location"]

    @property
    def meta(self):
        return self._.get("meta", {})

    @property
    def submission(self):
        return self._.get("submission")

    @property
    def type(self):
        return dict(http="api", browser="rpc").get(context.remote_caller.type)

    def state(self):
        """."""
        if (
            self.type == "rpc"
            and env
            or self.type == "api"
            and self.meta.get("same_origin")
            and env
        ):
            from anvil.server import session, get_session_id

            state = session.get("state")
            if state:
                if state["id"] == self.meta.get("sub_session"):
                    ...
                else:
                    state = dict(id=self.meta.get("sub_session"), private={}, public={})
            else:
                state = dict(id=self.meta.get("sub_session"), private={}, public={})
                session["state"] = state
            self.meta["session"] = get_session_id()
        else:
            state = dict(id=self.meta.get("sub_session"), private={}, public={})
            session = dict(state=state)
        self.meta["state"] = state["public"]
        return state

    @staticmethod
    def test(name):
        """Allows injection of uncommitted target from local test server."""
        if DEV:
            try:
                text = call("_get_api_text", name)
                exec(
                    text,
                    dict(Api=Api, api=api, print=print),
                    {},
                )
            except:
                pass


# Register
http_endpoint(f"/main", methods=["POST"])(Main())


class Rpc(Main):
    """
    TODO
    Hint-based inferral of return type instead for 'returns'
    data as blob. auto-detect
    """

    def __init__(self):
        self._ = dict()

    def __call__(self, name: str, data: dict = None, submission: int = None, **query):
        # log("RPC context.client.type:", context.client.type)  ##
        # Set submission
        self._["submission"] = submission
        # Allow injection of test target from local uplink server
        self.test(name)
        # Prepare meta
        self._["meta"] = dict(
            env=env,
            name=name,
            submission=self.submission,
            sub_session=query.get("session", f"server-{str(uuid.uuid4())}"),
            time={"in": datetime.now(timezone.utc).isoformat()},
            token=query.get("token", f"server-{str(uuid.uuid4())}"),
            type=self.type,
        )
        # Setup state
        state = self.state()
        # Retrieve registered
        if name not in api.registry:
            return dict(__error__=f"Invalid target: {name}", meta=self.meta)
        registered = api.registry[name]
        target, options = registered["target"], registered["options"]
        args, kwargs = data.pop("args", []), data.pop("kwargs", {})
        # Create response from target result
        try:
            if "__init__" in target.__dict__:
                instance = target(meta=self.meta, owner=self, state=state)
            else:
                instance = target()
            result = instance(*args, **kwargs)
        except:
            return dict(__error__=traceback.format_exc(), meta=self.meta)
        if callable(result):
            result = result()
        self.meta["time"]["out"] = datetime.now(timezone.utc).isoformat()
        # Send response
        returns = options.get("returns", dict)
        if returns is dict:
            return dict(result=result, meta=self.meta)
        if returns is BlobMedia:
            content = json.dumps(result).encode("utf-8")
            """HACK Use 'name' as pseudo response headers -> client can read 
            'meta' without opening blob"""
            name = json.dumps(self.meta)
            return BlobMedia("response", content, name=name)

        return dict(__error__=f"Invalid return type: {str(returns)}", meta=self.meta)


# Register
@rpc
def main(*args, **kwargs):
    """Single-point server function (rpc) that delegates to targets by name."""
    return Rpc()(*args, **kwargs)
