"""
state/state.py
"""


def main(use, *args, **kwargs):
    """."""

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

    import copy


    class State:
        """Reactive state tool."""
        # NOTE Can be used as a reactive and stateful effect to another State instance.
        def __init__(self, value=None):
            owner = self
            registry = dict()
            _ = dict(detail=dict(), registry=registry)

            class effects:
                @property
                def size(self):
                    return len(registry)

                def add(
                    self, effect: callable, once: bool = False, run: bool = False
                ) -> callable:
                    if run:
                        effect(owner.current, owner.previous)
                        if once:
                            return effect
                    spec = dict()
                    if once:
                        spec.update(once=once)
                    registry[effect] = spec
                    return effect

                def clear(self) -> None:
                    registry.clear()

                def has(self, effect: callable) -> bool:
                    return effect in registry

                def remove(self, effect: callable) -> None:
                    registry.pop(effect, None)

            effects = effects()

            class effect:
                def __init__(self, once: bool = False, run: bool = False):
                    self.once = once
                    self.run = run

                def __call__(self, effect: callable) -> callable:
                    effects.add(effect, once=self.once, run=self.run)
                    return effect

            _.update(effect=effect, effects=effects)

            if value is not None:
                _.update(current=value)
            self._ = _

        def __call__(self, value, *args, silent=False, **kwargs):
            if value is None:
                return self
            current = self._.get("current")
            # Abort if no change
            if current == value:
                return self
            # Update previous
            previous = current
            self._.update(previous=previous)
            # Update current
            current = value
            self._.update(current=current)
            # Abort if silent
            if silent:
                return self
            registry = self._["registry"]
            # Abort if no effeects
            if not registry:
                return self
            # Run effects
            remove = []
            for effect, spec in registry.items():
                once = spec.get("once")
                effect(self.current, self.previous)
                if once:
                    remove.append(effect)
            # Remove 'once' effects
            for effect in remove:
                registry.pop(effect)

        @property
        def current(self):
            value = self._.get("current")
            if isinstance(value, (dict, list, tuple)):
                value = copy.deepcopy(value)
            return value

        @property
        def detail(self) -> dict:
            return self._["detail"]

        @property
        def effect(self):
            """Decorates effect."""
            return self._["effect"]

        @property
        def effects(self):
            """Returns effects controller."""
            return self._["effects"]

        @property
        def previous(self):
            value = self._.get("previous")
            if isinstance(value, (dict, list, tuple)):
                value = copy.deepcopy(value)
            return value
