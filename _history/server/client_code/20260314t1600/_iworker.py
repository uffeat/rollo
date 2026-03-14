from ..console import console, log
from ..document import document
from ..meta import meta
from ..native import native
from ..tools import Promise
from ..use import use
from ..window import window
from ..works import works




_is = use("@/rollo/")["is"]


def iframe(**data):
    """Sets props on iframe."""
    # NOTE Intended for setting attrs, CSS vars and classes
    promise = Promise()
    channel = native.MessageChannel()

    def onmessage(event):
        channel.port1.close()
        promise(event.data)

    channel.port1.onmessage = onmessage
    window.parent.postMessage(
        dict(
            type="iframe",
            data=data,
        ),
        meta.client.origin,
        [channel.port2],
    )
    result = promise.wait()
    # print("Resize confirmation:", result)  ##
    return result


def on_resize_y(event):
    """Sets height on iframe."""
    iframe(__height=f'{event.detail}px')


class iworker(works.HtmlTemplate):
    def __init__(
        self,
        page: str = None,
        path: str = None,
        query: dict = None,
        session: str = None,
        targets: list = None,
        **props,
    ):
        if not meta.iworker:
            return

        self._ = {}

        # Get server data
        targets = tuple(targets.sort() or targets) if targets else tuple()
        self(session=session, targets=targets)
        use.assets.meta.server.targets = targets
        # log("session:", session, trace=__file__)  ##
        self.connect()

    def __call__(self, **updates):
        self._.update(updates)
        return self

    def __getitem__(self, key: str):
        return self._.get(key)

    def __getattr__(self, key: str):
        return self[key]

    def connect(self):
        """Performs handshake and sets up request handler."""
        # Guard against redundant calls
        if self.connected:
            return
        self(connected=True)

        @window.on()
        def message(event):
            """Handles request-response."""
            if not self.qualify(event, type="request"):
                return
            # Extract data from event
            port = event.ports[0]
            specifier = event.data.specifier
            args = getattr(event.data, "args", [])
            kwargs = getattr(event.data, "kwargs", {})
            submission = getattr(event.data, "submission", None)
            visible = getattr(event.data, "visible", False)


            if visible:
                use.app.addEventListener('_resize_y', on_resize_y)



            # Get target
            target = use(specifier, test=getattr(event.data, "test", False))
            # Call target and post result
            try:
                if isinstance(target, type):
                    is_component = issubclass(target, works.HtmlTemplate)
                    if "__init__" in target.__dict__:
                        instance = target(submission=submission, visible=visible)
                    else:
                        instance = target()
                    if is_component:
                        use.main.child = instance
                else:
                    instance = target

                result = instance(*args, **kwargs) if callable(instance) else None
                if isinstance(result, Promise):
                    result = result.wait()

                port.postMessage(dict(result=result, submission=submission))
            except Exception as error:
                port.postMessage(
                    dict(error=f"Error when calling '{specifier}': {str(error)}")
                )

            if visible:
                use.app.removeEventListener('_resize_y', on_resize_y)
                iframe(__height=0)

        # Handshake
        promise = Promise()
        channel = native.MessageChannel()

        def onmessage(event):
            log("Init data from client:", event.data)  ##
            channel.port1.close()
            promise(event.data)

        channel.port1.onmessage = onmessage
        # Send init data to client
        window.parent.postMessage(
            dict(
                type="ready",
                detail=dict(
                    packages=use.packages.keys(),
                    server=dict(session=self.session, targets=self.targets),
                ),
            ),
            meta.client.origin,
            [channel.port2],
        )
        promise.wait()

    @staticmethod
    def qualify(event, **kwargs):
        if event.origin != meta.client.origin:
            return
        if not _is.object(event.data):
            return
        if "type" in kwargs and event.data.type != kwargs["type"]:
            return
        return True
