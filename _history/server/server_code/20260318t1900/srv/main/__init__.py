from anvil.server import callable as callable_, http_endpoint
from ._api import Api
from ._rpc import Rpc


# Register
http_endpoint(f"/main", methods=["POST"])(Api())


# Register
@callable_
def main(*args, **kwargs):
    return Rpc()(*args, **kwargs)
