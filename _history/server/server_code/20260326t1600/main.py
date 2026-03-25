import json
import traceback
from anvil import BlobMedia
from anvil.server import call, callable as rpc, context, http_endpoint, session
from .tools import Date, State, log, meta, session_id


DEV, env, origin = meta.DEV, meta.env, meta.origin

class Main:
    """."""

    def __init__(self):
        """."""

    def __call__(
        self,
        name: str,
        data: dict = None,
        submission: int = None,
        test: bool = False,
        **rest,
    ):
        if isinstance(submission, str):
            submission = submission.strip()
            if submission.isdigit():
                submission = int(submission)

        request_type = dict(http="api", browser="rpc").get(context.remote_caller.type)
        server_state = State(session)

        # In DEV, allow delegation to local uplink server
        if DEV and test:
            try:
                response: dict = call(
                    "_main",
                    name,
                    data=data,
                    origin=origin,
                    request_type=request_type,
                    server_state=server_state.dto,
                    session_id=session_id,
                    submission=submission,
                    **rest,
                )
                return response
            except:
                log("Not delegating to local server.")

        # Parse data
        if data is None:
            data = {}
        args, kwargs, client_state = (
            data.pop("args", []),
            data.pop("kwargs", {}),
            data.pop("state", None),
        )

        # Prepare meta
        meta = dict(
            client_state=client_state,
            entry=Date.now()(),
            env=env,
            name=name,
            origin=origin,
            request_type=request_type,
            same_origin=True,
            server_state=server_state.dto,
            session_id=session_id,
            submission=submission,
        )

        # In DEV, allow injection of test target from local uplink server
        if DEV and test:
            try:
                meta["test"] = True
                result = call(name, *args, _meta=meta, **kwargs)
                meta["exit"] = Date.now()()
                response = dict(result=result, meta=meta)
                return response
            except:
                log(f"Not using test target for '{name}'.")

        # Import target module
        try:
            module = __import__(name)
        except:
            return dict(__error__=f"Invalid target: {name}.", meta=meta)

        # Get target
        target = module.__dict__.get(name)
        # Check target
        if not callable(target):
            return dict(
                __error__=f"Target '{name}' does not expose a same-name callable.",
                meta=meta,
            )

        # Get instance
        if isinstance(target, type):
            if "__init__" in target.__dict__:
                instance = target(meta=meta)
            else:
                instance = target()
                instance.meta = meta
        else:
            instance = target

        # Get result
        try:
            result = instance(*args, **kwargs)
        except:
            return dict(__error__=traceback.format_exc(), meta=meta)

        # Allow instance to return callable
        if callable(result):
            result = result()

        # Add exit time to meta
        meta["exit"] = Date.now()()
        # Add result type to meta
        meta["result_type"] = "" if result is None else type(result).__name__

        # Create response
        response = dict(result=result, meta=meta)

        """
        if isinstance(result, BlobMedia):
            # result is already a blob -> do not wrap result in blob
            meta["response_type"] = "dict"
            response = dict(result=result, meta=meta)
        else:
            # Return blob to avoid size limitations
            meta["response_type"] = "BlobMedia"
            # HACK Pack meta into blob name -> readable without opening blob
            response = BlobMedia(
                "response", json.dumps(result).encode("utf-8"), name=json.dumps(meta)
            )
        """


        

        # Send response
        return response

# Register
@rpc
def main(*args, **kwargs):
    """."""
    return Main()(*args, **kwargs)
