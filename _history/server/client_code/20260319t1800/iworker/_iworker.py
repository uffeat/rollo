from ..console import console, log
from ..meta import meta
from ..use import use
from ..window import window
from ..works import works
from ._event import Event
from ._respond import respond
from ._send import send


@window.on()
def message(event):
    """Handles data request."""
    event = Event(event)
    if event.ok and event.type == "request":
        respond(event)


@window.on()
def message(event):
    """Handles visual request."""
    event = Event(event)
    if event.ok and event.type == "show":
        respond(event)


class iworker(works.Spacer):
    """Server route that connects with client."""

    def __init__(
        self,
        page: str = None,
        path: str = None,
        query: dict = None,
        session: str = None,
        targets: list = None,
        **props,
    ):
        from_server = dict(
            page=page,
            path=path,
            query=query,
            session=session,
            targets=targets,
            props=props,
        )
        ##log("Data from server:", from_server, trace=__file__)  ##
        if not meta.IWORKER:
            return
        targets = tuple(targets.sort() or targets) if targets else tuple()
        use.assets.meta.server.targets = targets
        
        # Handshake
        to_client = dict(
            iworker=dict(packages=use.packages.keys()), server=dict(targets=targets)
        )
        ##log("Data to client:", to_client, trace=__file__)  ##
        from_client = send.handshake(**to_client)
        ##log("Data from client:", from_client, trace=__file__)  ##
