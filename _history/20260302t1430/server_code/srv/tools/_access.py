from anvil.server import call
from ._env import DEV


def access():
    """Tests if local access server provides access."""
    if DEV:
        try:
            return call("_access")
        except:
            return
    return True
    
