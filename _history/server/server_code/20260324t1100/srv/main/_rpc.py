import json
import traceback
from anvil import BlobMedia
from anvil.server import call, context, session
from ..tools import Date, State, api, log, meta, session_id


# XXX TODO Integrate as http 

class Rpc:
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

        _type = dict(http="api", browser="rpc").get(context.remote_caller.type)

        _state = State(session)

        # XXX TODO create meta and parse data before and remove these from local (allows for compat wuth http)

        ##
        ##
        if meta.DEV and test:
            try:

                response: dict = call(
                    "_main",
                    name,
                    data=data,
                    origin=meta.origin,
                    session_id=session_id,
                    state=_state.dto,
                    submission=submission,
                    _type=_type,
                    **rest,
                )

                return response
            except:
                pass
        ##
        ##

        # Parse data
        if data is None:
            data = {}
        args, kwargs, state = (
            data.pop("args", []),
            data.pop("kwargs", {}),
            data.pop("state", {}),
        )

        # Prepare meta
        _meta = dict(
            entry=Date.now()(),
            env=meta.env,
            name=name,
            origin=meta.origin,
            same_origin=True,
            session_id=session_id,
            state=state,
            submission=submission,
            type=_type,
        )

        # Allow injection of test target from local uplink server
        ##
        ##
        # XXX TODO Refactor to args=args etc.
        if meta.DEV and test:
            try:
                _meta["test"] = True
                result = call(name, *args, _meta=_meta, _state=_state.dto, **kwargs)
                _meta["exit"] = Date.now()()
                response = dict(result=result, meta=_meta)
                return response
            except:
                log(f"Not using test target for '{name}'.")
        ##
        ##

        # Retrieve registered
        if name not in api.registry:
            return dict(__error__=f"Invalid target: {name}", meta=_meta)
        registered = api.registry[name]
        target, options = registered["target"], registered["options"]
        # Create response from target result
        try:
            if "__init__" in target.__dict__:
                instance = target(meta=_meta)
            else:
                instance = target()
                instance.meta = _meta
            result = instance(*args, **kwargs)
        except:
            return dict(__error__=traceback.format_exc(), meta=_meta)
        if callable(result):
            result = result()
        # Add exit time to meta
        _meta["exit"] = Date.now()()
        # Determine return type
        returns = options.get("returns", dict)
        # Create response
        if returns is BlobMedia:
            """HACK Use 'name' as pseudo response headers -> client can read
            'meta' without opening blob"""
            response = BlobMedia(
                "response", json.dumps(result).encode("utf-8"), name=json.dumps(_meta)
            )
        else:
            response = dict(result=result, meta=_meta)
        # Send response
        return response
