import traceback
from anvil.server import callable as callable_
from ._blob import Blob
from ._env import PROD, env


class rpc:
    """."""

    def __init__(self, name: str = None, binary=True, **options):
        self.name = name
        self.binary = binary
        self.options = options

    def __call__(self, target: type):
        self.name = self.name if self.name else target.__name__.lower()

        def wrapper(*args, submission=None, **kwargs):
            # Interpret submission
            submission = None if submission is None else int(submission)
            # Prepare meta
            meta = dict(
                env=env,
                name=self.name,
                session_id=None, # XXX Cannot access 'session' from Uplink
                submission=submission,
                type="rpc",
            )
            # Get result from target
            if PROD:
                result = target()(*args, meta={**meta}, **kwargs)
            else:
                # NOTE try-except carries a cost, so only do in DEV
                try:
                    result = target()(*args, meta={**meta}, **kwargs)
                except:
                    result = dict(__error__=traceback.format_exc())

            result = result() if callable(result) else result
            result = dict(result=result, meta=meta)

            if self.binary:
                result = Blob(content=result, content_type="data", name=self.name).blob
            return result

        wrapper.__name__ = self.name
        # Register
        callable_()(wrapper)
        return target  # Enables stacking
