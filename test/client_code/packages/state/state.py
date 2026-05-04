def main(use, *args, **kwargs):

    use("@@/assets/")
    anvil, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
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
    app = use("@@/app/", test=meta.test)
    component = use("@@/component/")

    import copy


    class Message:
        def __init__(self, **_):
            self.__dict__["_"] = _

        def __getattr__(self, key: str):
            return self[key]

        def __getitem__(self, key: str):
            return self._.get(key)


    class State:
        """Reactive state tool."""

        def __init__(self, value=..., name=None):
            owner = self
            registry = dict()
            _ = dict(detail=dict(), registry=registry)
            if name:
                _.update(name=name)
            if value is not ...:
                _.update(current=value)
            self._ = _

            class effects:
                @property
                def size(self):
                    return len(registry)

                def add(
                    self,
                    effect: callable,
                    data: dict = None,
                    name: str = "",
                    once: bool = False,
                    run: bool = False,
                ) -> callable:
                    
                    log('HERE', trace="effects")##
                    

                    if data is None:
                        data = {}
                    if not name:
                        name = getattr(effect, "__name__", "")

                    detail = dict(data=data, effect=effect, name=name, owner=owner)
                    if once:
                        detail.update(once=once)
                    if run:

                        log('owner:', owner, trace="effects")##


                        message = Message(
                            ##current=owner.current,
                            ##previous=owner.previous,
                            session=None,
                            **detail
                        )
                        effect(message)
                        if once:
                            return effect
                    registry[effect] = detail
                    return effect

                def clear(self) -> None:
                    registry.clear()

                def has(self, effect: callable) -> bool:
                    return effect in registry

                def remove(self, effect: callable) -> None:
                    registry.pop(effect, None)

            effects = effects()

            class effect:
                def __init__(self, **kwargs):
                    self.kwargs = kwargs

                def __call__(self, effect: callable) -> callable:
                    effects.add(effect, **self.kwargs)
                    return effect

            _.update(effect=effect, effects=effects)


        def __call__(self, value, silent=False):
            if value is ...:
                return self
            current = self._.get("current", ...)
            # Abort if no change
            if current == value:
                return self
            # Update previous
            previous = current
            self._.update(previous=previous)
            # Update current
            current = value
            self._.update(current=current)
            # Init session
            if self.session is None:
                self._["session"] = 0
            # Abort if silent
            if silent:
                return self
            registry = self._["registry"]
            # Abort if no effeects
            if not registry:
                return self
            # Run effects
            remove = []
            for effect, detail in registry.items():
                once = detail.pop("once", False)

                message = Message(
                    current=self.current,
                    previous=self.previous,
                    session=self.session,
                    **detail
                )

                effect(message)
                if once:
                    remove.append(effect)
            # Remove 'once' effects
            for effect in remove:
                registry.pop(effect)
            # Update session
            self._["session"] += 1

        @property
        def current(self):
            value = self._.get("current", ...)
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
            value = self._.get("previous", ...)
            if isinstance(value, (dict, list, tuple)):
                value = copy.deepcopy(value)
            return value

        @property
        def name(self) -> str:
            return self._.get("name", "")

        @property
        def session(self) -> str:
            return self._.get("session")



    return dict(State=State)
