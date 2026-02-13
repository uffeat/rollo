import json
import traceback
from anvil import BlobMedia
from anvil.server import callable as callable_
from ._env import env


class rpc:
    """."""

    def __init__(self, **options):
        # NOTE Using '**options' provides flexibility for polymorphic targets.
        self.options = options

    def __call__(self, target: type):
        name = self.options.get("name", target.__name__.lower())

        def wrapper(request: dict = None, submission: int = None):
            """NOTE Do work inside wrapper to avoid costs unrelated to the 
            current target."""
            # Extract arguments for target
            args, kwargs = request.get("args", []), request.get("kwargs", {})
            # Prepare meta
            meta = dict(
                env=env,
                name=name,
                session_id=None,  # XXX Cannot access 'session' from Uplink
                submission=submission,
                type="rpc",
            )
            # Get result from target
            try:
                # NOTE Copy meta to guard against mutation in target
                result = target()(*args, meta={**meta}, **kwargs)
            except:
                return dict(__error__=traceback.format_exc(), meta=meta)
            if callable(result):
                result = result()
            # Send response
            if self.options.get("binary"):
                content = json.dumps(result).encode("utf-8")
                # 
                """HACK Use 'name' as pseudo response headers -> client can read 
                'meta' without opening up blob"""
                return BlobMedia("response", content, name=json.dumps(meta))
            return dict(result=result, meta=meta)

        # Rename wrapper to ensure correct registration key
        wrapper.__name__ = name
        # Register
        callable_()(wrapper)
        return target  # Enables stacking
