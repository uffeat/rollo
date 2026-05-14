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

    Error = tools.Error

    import copy

    class Effects:
        def __init__(self, owner=None):
            self._ = dict(owner=owner, registry=dict())

        def __bool__(self):
            return bool(len(self._["registry"]))

        def __call__(self):
            """."""
            log("Number of effects:", len(self), trace="Effects.__call__")  ##
            # Abort if no effeects
            if not self:
                log("No effects", trace="Effects.__call__")  ##
                return self
            registry: dict = self._["registry"]
            # Create message for effects
            message = Message(
                current=self.owner.current,
                owner=self.owner,
                previous=self.owner.previous,
                session=self.owner.session,
            )
            remove = []

            for index, (effect, detail) in enumerate(registry.items()):
                log("index:", index, trace="State.__call__")  ##
                log("Effect detail:", detail, trace="State.__call__")  ##
                once = detail.pop("once", False)
                # Update effect-specific parts of message
                message._.update(effect=effect, detail=detail, index=index)
                # Run effect
                effect(message)
                if once:
                    remove.append(effect)
            # Remove 'once' effects
            for effect in remove:
                self.remove(effect)

        def __contains__(self, effect: callable):
            return effect in self._["registry"]

        def __iter__(self):
            return iter(self._["registry"].items())

        def __len__(self):
            return len(self._["registry"])

        @property
        def owner(self):
            return self._["owner"]

        @property
        def size(self):
            return len(self._["registry"])

        def add(
            self,
            effect: callable,
            data: dict = None,
            name: str = "",
            once: bool = False,
            run: bool = False,
        ) -> callable:
            if data is None:
                data = {}

            if not name:
                name = getattr(effect, "__name__", "")

            detail = dict(data=data, name=name)

            if run:
                message = Message(
                    current=self._["owner"].current,
                    owner=self._["owner"],
                    previous=self._["owner"].previous,
                    session=None,
                )
                message._.update(effect=effect, detail=detail)
                log("Running effect before registration", trace="Effects.add")  ##
                effect(message)
                if once:
                    log("Not registering effect.", trace="Effects.add")  ##
                    return effect
            if once:
                detail.update(once=once)

            self._["registry"][effect] = detail
            log("Registered effect with detail:", detail, trace="Effects.add")  ##
            return effect

        def clear(self) -> None:
            self._["registry"].clear()

        def has(self, effect: callable) -> bool:
            return effect in self._["registry"]

        def remove(self, effect: callable) -> None:
            self._["registry"].pop(effect, None)

    class Message:
        def __init__(
            self, change=None, current=None, owner=None, previous=None, session=None
        ):
            self._ = dict(
                change=change,
                current=current,
                owner=owner,
                previous=previous,
                session=session,
            )

        @property
        def change(self):
            return self._.get("change")

        @property
        def current(self):
            return self._["current"]

        @property
        def owner(self):
            return self._["owner"]

        @property
        def detail(self) -> dict:
            return self._.get("detail")

        @property
        def effect(self) -> callable:
            return self._.get("effect")

        @property
        def index(self) -> int:
            return self._.get("index")

        @property
        def previous(self):
            return self._["previous"]

        @property
        def session(self) -> int:
            return self._.get("session")

    class State:
        """Reactive state tool."""

        def __init__(self, *args, name=None):
            current = next(iter(args), None)

            effects = Effects(owner=self)

            class effect:
                def __init__(self, **kwargs):
                    self.kwargs = kwargs

                def __call__(self, effect: callable) -> callable:
                    effects.add(effect, **self.kwargs)
                    return effect

            self._ = dict(
                current=current,
                detail=dict(),
                effect=effect,
                effects=effects,
            )
            if current is not None:
                self._.update(current=current)

            if name:
                self._.update(name=name)

        def __call__(self, value, silent=False):
            if isinstance(value, (dict, list, tuple)):
                value = copy.deepcopy(value)
            current = self._.get("current")
            log("current before update:", current, trace="State.__call__")  ##
            log(
                "previous before update:",
                self._.get("previous"),
                trace="State.__call__",
            )  ##
            # Abort if no change
            if current == value:
                log("No change from:", value, trace="State.__call__")  ##
                return self
            # Update current and previous
            self._.update(current=value, previous=current)
            log("current updated to:", self.current, trace="State.__call__")  ##
            log("previous updated to:", self.previous, trace="State.__call__")  ##
            # Init session
            if self.session is None:
                self._["session"] = 0

            # Abort if silent
            if silent:
                log("silent -> do not run effects", trace="State.__call__")  ##
                return self

            self.effects()
            # Update session
            self._["session"] += 1

        @property
        def current(self):
            current = self._.get("current")
            if isinstance(current, (dict, list, tuple)):
                current = copy.deepcopy(current)
            return current

        @property
        def detail(self) -> dict:
            return self._["detail"]

        @property
        def effect(self):
            """Decorates effect."""
            return self._["effect"]

        @property
        def effects(self) -> Effects:
            """Returns effects controller."""
            return self._["effects"]

        @property
        def previous(self):
            previous = self._.get("previous")
            if isinstance(previous, (dict, list, tuple)):
                previous = copy.deepcopy(previous)
            return previous

        @property
        def name(self) -> str:
            return self._.get("name", "")

        @property
        def session(self) -> str:
            return self._.get("session")

    return dict(State=State)
