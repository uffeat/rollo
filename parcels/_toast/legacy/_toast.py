from anvil.js import ProxyType
from ..bootstrap import bootstrap
from ..component import component
from .._root import root

WHITE = ("danger", "dark", "primary", "secondary", "success")


class toast:
    def __init__(self):
        self._empty = True
        self._meta = component.meta({'[toasts]': True})
        self._toasts = None

    def __call__(
        self,
        content: str = None,
        delay: int = 5000,
        style: str = None,
        title: str = None,
    ) -> None:
        """Shows toast."""
        # Create toast (full lifecycle for each display)
        button = component.button(
            f"btn-close{'.btn-close-white' if style in WHITE else ''}",
            type="button",
        )
        button.attribute.dataBsDismiss = "toast"
        button.attribute.ariaLabel = "Close"
        element = component.div(
            "toast",
            component.div(
                f"toast-header{f'.text-bg-{style}' if style else ''}",
                component.h1(text=title),
                button,
            ),
            component.p("toast-body", content),
            parent=self.toasts,
            role="alert",
        )
        element.attribute.ariaLive = "assertive"
        element.attribute.ariaAtomic = "true"

        toast = bootstrap.Toast(element, delay=delay)

        if self._empty:
            
            root.append(self._meta)

        @button.event_handler(once=True)
        def onclick(event):
            """Hides toast.
            XXX Button click should, but does not hide automatically."""
            event.stopPropagation()
            toast.hide()

        @element.event_handler("hidden.bs.toast", once=True)
        def onhidden(event):
            """Cleans up."""
            event.stopPropagation()
            toast.dispose()
            element.remove()
            if not self.toasts.find("div.toast"):
                self._empty = True
                
                self._meta.remove()

        toast.show()

    @property
    def toasts(self) -> ProxyType:
        """Returns toasts container."""
        # Setup container and styles, if not done already
        if not self._toasts:
            root.sheets.add("/toast/toasts.sheet")
            self._toasts = component.div("toasts._root", parent=root)
        return self._toasts


toast = toast()
