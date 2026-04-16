from tools import connect, server_function


keep = connect()


@server_function
def _log(*args, **kwargs):
    try:
        args = [str(a) for a in args]
        print(*args)
    except Exception as error:
        print(f"Error when trying to log: {str(error)}")


keep("Running local server for logging.")
