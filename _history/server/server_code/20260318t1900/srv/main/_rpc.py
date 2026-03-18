import json
import traceback
from anvil import BlobMedia
from ..tools import Date, api, log, meta
from ._base import Base


class Rpc(Base):
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


        ##
        ##
        from anvil.server import session, get_session_id

        state = session.get("state")
        if state is None:
            state = dict(private={}, public={})
            session["state"] = state


        log('state:', state)

        
        ##
        ##





        # Prepare meta
        self._["meta"] = dict(
            env=meta.env,
            name=name,

            ##
            ##
            origin=meta.origin,
            same_origin=True,
            session_id=get_session_id(),
            ##
            ##

            state=state['public'],
            submission=self.submission,
            time={"in": Date.now()()},
            type=self.type,
        )
        # Setup state
        ##
        ##
        ##state = self.state()
        ##
        ##


        # Retrieve registered
        if name not in api.registry:
            return dict(__error__=f"Invalid target: {name}", meta=self.meta)
        registered = api.registry[name]
        target, options = registered["target"], registered["options"]
        args, kwargs, _state = (
            data.pop("args", []),
            data.pop("kwargs", {}),
            data.pop("state", {}),
        )
        self.meta["state"].update(_state)
        # Create response from target result
        try:
            if "__init__" in target.__dict__:
                instance = target(
                    meta=self.meta, 
                    owner=self,
                    ##
                    ##
                    state=state,
                    ##
                    ##
                )
            else:
                instance = target()
            result = instance(*args, **kwargs)
        except:
            return dict(__error__=traceback.format_exc(), meta=self.meta)
        if callable(result):
            result = result()
        self.meta["time"]["out"] = Date.now()()
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


