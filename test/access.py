from server_code.tools import connect, server_function


keep = connect()


@server_function
def _access():
    """Enables test calling as http endpoint."""
    return True


keep("Running local server for granting access.")
