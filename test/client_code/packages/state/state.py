def main(use, *args, **kwargs):

    use("@@/assets/")
    anvil, app, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.packages,
        use.tools,
        use.window,
    )

    

    class state:
        """."""

        def __init__(self, *args):
            """."""
            

            owner = self
            registry = []

            class effects:

                def add(self, effect: callable, run: bool = True, once: bool=False) -> callable:
                    """Adds effect."""
                    if effect not in registry:
                        registry.append(effect)
                    if run:
                        effect(
                            owner.current,
                            effect=effect,
                            owner=owner,
                        )

                    return effect

                def remove(self, effect):
                    """Removes effect."""
                    registry.remove(effect)

            effects = effects()

            class effect:
                def __init__(self, **kwargs):
                    self.kwargs = kwargs

                def __call__(self, effect):
                    effects.add(effect, **self.kwargs)
                    return effect
                

            class transform:
                def __init__(self):
                    """."""

                def __call__(self, transform):
                    owner._["transform"] = transform
                    return transform
                    

            self._ = dict(effect=effect)

        def __call__(self, value, silent=False, **kwargs):
            """."""
            
            return self

        @property
        def current(self):
            """."""
            return 

        @property
        def effect(self):
            """Decorates effect."""
            return self._["effect"]

        @property
        def previous(self):
            """."""
            return 

        @property
        def size(self):
            """."""
            

        

        def clear(self):
            """."""
            
            return self

    return dict(state=state)
