from ..console import console, log
from ..use import use
from ._send import send

ACTIVE = "active"


class iframe:
    """Controller for client iframe."""

    def __init__(self):
        owner = self

        class sync:
            """Controller for syncing app height to client iframe height."""

            def __init__(self):
                def _on_resize_y(event):
                    height = event.detail
                    ##log('Sending height to client iframe:', height, trace=__file__)
                    owner(__height=f"{height}px", _iworker=True)

                self._ = dict(_on_resize_y=_on_resize_y)

            def __getitem__(self, key: str):
                return self._.get(key)

            def __getattr__(self, key: str):
                return self[key]
            
            @property
            def active(self) -> bool:
                """."""
                return self._.get(ACTIVE)

            def start(self) -> None:
                """Activates sync to client iframe height."""
                if not self.active:
                    self._[ACTIVE] = True
                    ##log("Adding _resize_y", trace=__file__)  ##
                    use.app.addEventListener("_resize_y", self._on_resize_y)
                    use.main.node.setAttribute('sync', '')##
                    

            def stop(self) -> None:
                """Deactivates sync to client iframe height."""
                if self.active:
                    self._.pop(ACTIVE, None)
                    ##log("Removing _resize_y", trace=__file__)  ##
                    use.app.removeEventListener("_resize_y", self._on_resize_y)
                    use.main.node.removeAttribute('sync')##

            

            

        self._ = dict(sync=sync())

    def __call__(self, **updates):
        """Sets props on client iframe."""
        ##log("Sending updates to client iframe:", updates, trace=__file__, native=True)  ##
        result = send.iframe(**updates)
        ##log("Client confirmed updates:", getattr(result, 'detail', None), trace=__file__, native=True)  ##
        return result

    def __getitem__(self, key: str):
        return self._.get(key)

    def __getattr__(self, key: str):
        return self[key]
    
    @property
    def sync(self):
        return self._['sync']


iframe = iframe()
