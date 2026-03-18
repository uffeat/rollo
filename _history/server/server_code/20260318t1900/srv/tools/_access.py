from anvil.server import call
from ._meta import meta


def access():
    """Tests if local server provides access."""
    if meta.DEV:
        try:
            return call("_access")
        except:
            pass
    
    
