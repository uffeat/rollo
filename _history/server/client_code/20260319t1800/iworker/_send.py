from ..meta import meta
from ..native import native
from ..tools import Promise
from ..window import window


class send:
    """Calls 'client function' and returns result."""

    def __getitem__(self, type_: str):

        def caller(**detail):
            promise = Promise()
            channel = native.MessageChannel()

            def onmessage(event):
                channel.port1.close()
                promise(event.data)

            channel.port1.onmessage = onmessage

            window.parent.postMessage(
                dict(
                    type=type_,
                    detail=detail,
                ),
                meta.client.origin,
                [channel.port2],
            )

            result = promise.wait()
            return result

        return caller

    def __getattr__(self, key: str):
        return self[key]


send = send()
