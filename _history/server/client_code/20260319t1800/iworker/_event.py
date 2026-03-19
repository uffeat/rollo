from ..meta import meta
from ..use import use


_is = use("@/rollo/")["is"]


class Event:
    """Wrapper for message event."""

    def __init__(self, event):
        ok = (
            event.origin == meta.client.origin
            and _is.object(event.data)
            and len(event.ports)
        )
        self._ = dict(event=event, ok=ok)
        if ok:
            self._.update(
                dict(
                    args=event.data.args or [],
                    kwargs=event.data.kwargs or {},
                )
            )

    def __call__(self, **detail):
        """Sends message to client."""
        event = self._["event"]
        port = event.ports[0]
        port.postMessage(detail)

    def __getitem__(self, key: str):
        """Returns event item."""
        if key in self._:
            return self._[key]
        event = self._["event"]
        return getattr(event.data, key, None)

    def __getattr__(self, key: str):
        return self[key]
