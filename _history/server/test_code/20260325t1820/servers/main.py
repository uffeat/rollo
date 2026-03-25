"""Exposes server code as-is, regardless of commit status.
NOTE Run this script during DEV."""

from anvil.server import callable as callable_
from tools import connect


wait = connect()


# NOTE No file scanning -> explicitly import endpoints
from server_code.srv import bar, echo, foo, pilot, user

@callable_
def _log(*args):
    print(*args)




wait()
