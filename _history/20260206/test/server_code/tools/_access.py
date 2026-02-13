from anvil.server import call


def access():
    """Tests if local access server provides access."""
    result = call("access")
    return result
