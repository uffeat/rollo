from anvil.server import callable as rpc, http_endpoint
##from ._api import Api
from ._rpc import Rpc

# Register
##http_endpoint(f"/main", methods=["POST"])(Api())


@rpc
def main(*args, **kwargs):
    return Rpc()(*args, **kwargs)
