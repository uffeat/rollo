"""Injects 'media' server target."""

from anvil import BlobMedia
from tools import connect, db, server_function


keep = connect()


@server_function
def _access():
    """Enables test calling as http endpoint."""
    return True


@server_function
def _media(args: list = None, kwargs: dict = None, meta: dict = None):
    name = args[0]
    row = db.media.get(name=name)
    blob: BlobMedia = row["media"]
    return blob

       
keep("Running local server for serving 'media' server target.")
