from ..component import component
from ..console import console
from ..document import clean, document
from ..meta import meta
from ..native import native
from ..state import effect
from ..tools import Promise, construct_function, define, run
from ..use import use
from ..window import window
from ..works import works

document.documentElement.dataset.bsTheme = "dark"

use("@/rollo/")
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
        origin: str = None,
        page: str = None,
        path: str = "/",
        query: dict = None,
        session: str = None,
        targets: list = None,
        **props,
    ):
        self._ = {}

        # Create slot as app-component to get access to resize features
        self.html = '<app-component anvil-slot="default"></app-component>'
        # Make node identifiable
        self._["node"] = works.get_dom_node(self)
        self._["node"].setAttribute(self.__class__.__name__, "")
        # Provide access to iworker via node
        define(self._["node"]).value(self, name="host")
        # Extract app component
        self._["app"] = self._["node"].querySelector("app-component")
        # Get server data
        self._["targets"] = tuple(targets.sort() or targets) if targets else tuple()
        self._["session"] = session

        console.log("origin:", origin)  ##
        # console.log("page:", page)  ##
        # console.log("path:", path)  ##
        # console.log("query:", query)  ##
        # console.log("session:", session)  ##
        # console.log("targets:", targets)  ##
        # console.log("props:", props)  ##

        self.connect()

        @effect(self._["app"], "Y")
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
                        instance = target(*args, **kwargs)
                    else:
                        instance = target()
                    if is_component:
                        self.clear()
                        self.add_component(instance)
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

    


# Clean up document
clean()
