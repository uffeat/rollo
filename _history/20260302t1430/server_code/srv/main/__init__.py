from datetime import datetime, timedelta, timezone
import json
import traceback
import uuid
from anvil import BlobMedia
from anvil.server import (
    call,
    callable as callable_,
    context,
    get_app_origin,
    http_endpoint,
    request as http_request,
)
from ..tools import (
    Api,
    DEV,
    PROD,
    Response,
    access,
    api,
    env,
)
from ._state import State

if DEV:

    @callable_
    def _get_api_text(name):
        """For overloading by local server."""

    @callable_
    def _log(*args):
        """For overloading by local server."""

    def print(*args):
        call("_log", *args)


class Gate:
    """Single-point http endpoint that delegates to class-based targets by name.
    Intended for fast zero-preflight client-server coms.
    TODO
    - Allow blob responses with automatic detection based of target result
      type-checking or explicit declaration via options.
      Will require smart detection client-side, perhaps based on type-checking,
      perhaps based on (custom?) response headers.
    """

    ALLOWED_ORIGINS = set(
        ["https://rolloh.vercel.app", "https://fastapilab.onrender.com"]
    )

    def __call__(self, name="", session=None, submission=None, token=None):
        """Single-point api that delegates to targets by name."""
        # Allow injection of test target from local uplink server

        print("context.type:", context.type)  ## browser, server_module, uplink

        print("context.client.ip:", context.client.ip)  ##
        print("context.client.type:", context.client.type)  ##

        if context.client.location:
            print("city:", context.client.location.city)  ##
            print("country:", context.client.location.country)  ##
            print("latitude:", context.client.location.latitude)  ##
            print("longitude:", context.client.location.longitude)  ##

        print("is_trusted:", context.remote_caller.is_trusted)  ##
        print("remote_caller.type:", context.remote_caller.type)  ##

        self.test(name)
        # Prepare http_response
        http_response = Response()
        # Inspect origin
        request_origin = http_request.headers.get("origin")
        if not request_origin:
            return Response(status=403)
        same_origin = get_app_origin() == request_origin
        # Interpret submission
        submission = None if submission is None else int(submission)
        # Prepare meta
        meta = dict(
            env=env,
            name=name,
            submission=submission,
            token=token,
            type="api",
        )
        # Control access
        if not same_origin:
            if PROD:
                if request_origin not in self.ALLOWED_ORIGINS:
                    return Response(status=403)
            else:
                # NOTE In DEV, a local server must run to provide access.
                if context.type != "uplink":

                    if not access():
                        return Response(status=403)

        # Setup state
        if same_origin and env:
            from anvil.server import get_session_id

            session_id = get_session_id()
            meta["session"] = session_id

            state = self.State()
        else:
            meta["session"] = session

            state = self.State(id=token, submission=submission)

        # Retrieve registered
        if name not in api.registry:
            return Response(status=401)
        registered = api.registry[name]
        target, options = registered["target"], registered["options"]
        # Create response from target result
        try:
            if "__init__" in target.__dict__:
                instance = target(meta={**meta}, owner=self, state=state)
            else:
                instance = target()

            if options.get("raw"):
                # raw option -> No need to read request body
                result = instance(data=http_request.body)
            else:
                data: dict = json.loads(
                    http_request.body.get_bytes().decode("utf-8")
                ).pop("data", {})
                args, kwargs = data.get("args", []), data.get("kwargs", {})
                result = instance(*args, **kwargs)

            if callable(result):
                result = result()

            meta["state"] = state.public()

            response = dict(result=result, meta=meta)
        except:
            """NOTE MUCH better than bland status codes! Use 'ok' etc.
            convention inside result for soft validation signal."""
            response = dict(__error__=traceback.format_exc(), meta=meta)
        # NOTE response is always a dict.
        http_response.body = json.dumps(response)
        return http_response

    def State(self, id: str = None, submission: int = None):
        """Sets up state."""
        if id:
            state = State(id=id, db=True)
            if not submission:
                state.private.clear(future=True)
                state.public.clear(future=True)
        else:
            from anvil.server import get_session_id

            state = State(id=get_session_id())
        return state

    def test(self, name):
        """Allows injection of uncommitted target from local test server."""
        if DEV:
            text = call("_get_api_text", name)
            if text:
                exec(
                    text,
                    dict(Api=Api, api=api, print=print),
                    {},
                )


# Register
http_endpoint(f"/main", methods=["POST"])(Gate())


class Rpc(Gate):
    """
    TODO
    Hint-based inferral of return type instead for 'returns'
    """

    def __call__(
        self, name: str, request: dict = None, session=None, submission: int = None
    ):
        # Allow injection of test target from local uplink server
        self.test(name)

        # Prepare meta
        meta = dict(
            env=env,
            name=name,
            submission=submission,
            type="rpc",
        )

        # Setup state
        if env:
            from anvil.server import get_session_id

            session_id = get_session_id()
            meta["session"] = session_id

            state = self.State()

        else:
            session_id = session if session else str(uuid.uuid4())
            meta["session"] = session_id

            state = self.State(id=session_id, submission=submission)

        # Retrieve registered
        if name not in api.registry:
            return dict(__error__=f"Invalid target: {name}", meta=meta)
        registered = api.registry[name]
        target, options = registered["target"], registered["options"]
        args, kwargs = request.get("args", []), request.get("kwargs", {})
        # Create response from target result
        try:
            if "__init__" in target.__dict__:
                instance = target(meta={**meta}, owner=self, state=state)
            else:
                instance = target()
            result = instance(*args, **kwargs)
        except:
            return dict(__error__=traceback.format_exc(), meta=meta)
        if callable(result):
            result = result()
        # Add public state to response meta
        meta["state"] = state.public()
        # Send response
        returns = options.get("returns", dict)
        if returns is dict:
            return dict(result=result, meta=meta)

        if returns is BlobMedia:
            content = json.dumps(result).encode("utf-8")
            """HACK Use 'name' as pseudo response headers -> client can read 
            'meta' without opening blob"""
            name = json.dumps(meta)
            return BlobMedia("response", content, name=name)

        return dict(__error__=f"Invalid return type: {str(returns)}", meta=meta)


# Register
@callable_
def main(*args, **kwargs):
    """Single-point server function (rpc) that delegates to targets by name."""
    return Rpc()(*args, **kwargs)
