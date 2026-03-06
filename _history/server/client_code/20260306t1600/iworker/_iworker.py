from ..console import console, log
from ..document import document
from ..meta import meta
from ..native import native
from ..tools import Promise, construct_function, run
from ..use import use
from ..window import window
from ..works import works

log(trace=__file__)


_is = use("@/rollo/")["is"]


def iframe(**data):
    """Sets props on iframe.
    NOTE Intended for setting attrs, CSS vars and classes."""
    promise = Promise()
    channel = native.MessageChannel()

    def onmessage(event):
        # print("data:", event.data)  ##
        channel.port1.close()
        promise(event.data)

    channel.port1.onmessage = onmessage
    window.parent.postMessage(
        dict(
            type="display",
            data=data,
        ),
        meta.client.origin,
        [channel.port2],
    )
    result = promise.wait()
    # print("Resize confirmation:", result)  ##
    return result


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
        self._["targets"] = tuple(targets.sort() or targets) if targets else tuple()
        self._["session"] = session

        # console.log("page:", page)  ##
        # console.log("path:", path)  ##
        # console.log("query:", query)  ##
        # console.log("session:", session)  ##
        # console.log("targets:", targets)  ##

        self.connect()

        @use.main.effect("Y")
        def resize(change, message):
            """."""
            previous = message.owner.previous.Y
            current = change.Y
            if current and not previous:
                iframe(__height="100vh")
            elif not current and previous:
                iframe(__height=0)

    def connect(self):
        """Performs handshake and sets up request responder."""
        # Guard against redundant calls
        if self._.get("connected"):
            return
        self._["connected"] = True

        @window.on()
        def message(event):
            """Handles request-response."""
            # Qualify event
            if event.origin != meta.client.origin:
                return
            if not _is.object(event.data):
                return
            if event.data.type != "request":
                return
            # Extract data from event
            port = event.ports[0]
            specifier = event.data.specifier
            args = getattr(event.data, "args", [])
            kwargs = getattr(event.data, "kwargs", {})

            ##
            ##
            _meta = getattr(event.data, "meta", {})
            ##
            ##

            # Enable package injection by local server in DEV
            if (
                meta.DEV
                and getattr(event.data, "test", False)
                and specifier.startswith("@@/")
            ):
                name, member = specifier[3:], None
                if name.endswith("/"):
                    name = name[:-1]
                    member = name
                elif ":" in name:
                    name, member = name.split(":")
                try:
                    text = works.server.call("_package", name)
                    main = construct_function(text)
                    package = main(use)
                    if member:
                        target = package[member]
                    else:
                        target = package
                except:
                    target = use(specifier)
            else:
                target = use(specifier)
            # Call target and post result
            try:
                if isinstance(target, type):
                    is_component = issubclass(target, works.HtmlTemplate)
                    if "__init__" in target.__dict__:
                        ##
                        ##
                        ##instance = target(**_meta)
                        instance = target()
                        ##
                        ##
                    else:
                        instance = target()
                    if is_component:
                        use.main.child = instance
                else:
                    instance = target
                result = instance(*args, **kwargs) if callable(instance) else None
                port.postMessage(dict(result=result))
            except Exception as error:
                port.postMessage(
                    dict(error=f"Error when calling '{specifier}': {str(error)}")
                )

        # Init handshake
        window.parent.postMessage(
            dict(
                type="ready",
                data=dict(
                    browser=dict(
                        session=use.assets.meta.session, token=use.assets.meta.token
                    ),
                    packages=use.packages.names,
                    server=dict(session=self._["session"], targets=self._["targets"]),
                ),
            ),
            meta.client.origin,
        )

        @run()
        def conclude():
            """Concludes handshake."""

            promise = Promise()

            @window.on()
            def message(event):
                """Awaits client ready signal and init data."""
                # Qualify event
                if event.origin != meta.client.origin:
                    return
                if not _is.object(event.data):
                    return
                if event.data.type != "ready":
                    return
                window.removeEventListener("message", message)
                promise(event.data.data)

            data = promise.wait()
            # print("data:", data)  ##
