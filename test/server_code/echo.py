from tools import connect, server_function


keep = connect()


@server_function
def _access():
    """Enables test calling as http endpoint."""
    return True


@server_function
def _echo(args: list = None, kwargs: dict = None, meta: dict = None):
    from anvil.server import request

    print('request:', request)


    return "POW!"


keep("Running local server for serving 'echo'.")
