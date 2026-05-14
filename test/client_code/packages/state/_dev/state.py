import copy as _copy


def log(*args, **kwargs):
    print(*args)


PRIMITIVES = (bool, int, str)
SINGLETONS = (False, None, True)


def copy(value):
    """Returns deep copy of value if mutable else value."""
    if isinstance(value, (dict, list, tuple)):
        return _copy.deepcopy(value)
    return value


def difference(value, other):
    """."""
    if isinstance(value, dict) and isinstance(other, dict):
        change = {}
        for key, value in other.items():
            ...


class Effects:
    def __init__(self, owner=None):
        self._ = dict(owner=owner, registry=dict())

    def __bool__(self):
        return bool(len(self.registry))

    def __call__(self) -> "Effects":
        """Runs effects."""
        ##log("Number of effects:", len(self), trace="Effects.__call__")  ##
        # Abort if no effeects
        if self:
            transient = dict()
            # Create message for effects
            message = Message(
                owner=self.owner, session=self.owner.session, transient=transient
            )
            # Create container to capture 'once' effects
            remove = []
            # Run effects
            for index, (effect, detail) in enumerate(self):
                ##log("index:", index, trace="State.__call__")  ##
                ##log("Effect detail:", detail, trace="State.__call__")  ##
                once = detail.pop("once", False)

                # Update transient part of message

                transient.update(effect=effect, detail=detail, index=index)

                # Run effect
                effect(message)
                if once:
                    remove.append(effect)
            # Remove 'once' effects
            for effect in remove:
                self.remove(effect)
        return self

    def __contains__(self, effect: callable) -> bool:
        """Checks if effect registered."""
        return effect in self.registry

    def __iter__(self) -> iter:
        """Returns iterator for registry."""
        return iter(self.registry.items())

    def __len__(self) -> int:
        """Returns number of registered effects."""
        return len(self.registry)

    @property
    def owner(self) -> "State":
        return self._["owner"]

    @property
    def registry(self) -> dict:
        # XXX Should generally not be used externally, but exposed for special cases.
        return self._["registry"]

    @property
    def size(self) -> int:
        return len(self.registry)

    def add(
        self, effect: callable, once: bool = False, run: bool = False, **data
    ) -> callable:
        detail = dict(data=data)
        if run:
            transient = dict()
            message = Message(
                owner=self.owner,
                session=None,  # NOTE Signals non-reactive invocation
                transient=transient,
            )
            # Update transient part of message
            transient.update(effect=effect, detail=detail)
            ##log("Running effect before registration", trace="Effects.add")  ##
            effect(message)
            if once:
                ##log("Not registering effect.", trace="Effects.add")  ##
                return effect
        if once:
            detail.update(once=once)
        self.registry[effect] = detail
        ##log("Registered effect with detail:", detail, trace="Effects.add")  ##
        return effect

    def clear(self) -> None:
        self.registry.clear()

    def get(self, effect: callable, *args) -> dict:
        """Returns detail associated with effect."""
        default = next(iter(args), None)
        detail = self.registry.get(effect, default)
        return detail

    def has(self, effect: callable) -> bool:
        return effect in self.registry

    def remove(self, effect: callable) -> None:
        self.registry.pop(effect, None)

    def update(self, effect: callable, *updates) -> None:
        """Updates detail associated with effect."""
        detail = self.get(effect)
        if not isinstance(detail, dict):
            raise KeyError("Cannot update detail.")
        detail.update(updates)


class Message:

    @classmethod
    def keys(cls):
        return [
            k
            for k, v in cls.__dict__.items()
            if not k.startswith("__")
            and not k.endswith("__")
            and isinstance(v, property)
        ]

    def __init__(self, owner=None, session=None, transient: dict = None):
        self._ = dict(
            data=dict(),
            owner=owner,
            transient=transient,
        )
        if session is None:
            self._.update(session=session)

    @property
    def change(self):
        return self.owner.change

    @property
    def current(self):
        return self.owner.current

    @property
    def owner(self) -> "State":
        return self._["owner"]

    @property
    def detail(self) -> dict:
        # Belongs to effect
        transient: dict = self._["transient"]
        return transient.get("detail")

    @property
    def effect(self) -> callable:
        transient: dict = self._["transient"]
        return transient.get("effect")

    @property
    def index(self) -> int:
        # Belongs to effect
        transient: dict = self._["transient"]
        return transient.get("index")

    @property
    def previous(self):
        return self.owner.previous

    @property
    def session(self) -> int:
        if "session" in self._:
            return self._["session"]
        return self.owner.session

    def data(self, **updates) -> dict:
        """Updates and returns data."""
        # NOTE Own store
        data: dict = self._["data"]
        data.update(data)
        return data


class State:
    """Reactive state tool."""

    def __init__(self, *args, context=None, name: str = None):
        current = next(iter(args), ...)

        effects = Effects(owner=self)

        class effect:
            def __init__(self, **kwargs):
                self.kwargs = kwargs

            def __call__(self, effect: callable) -> callable:
                effects.add(effect, **self.kwargs)
                return effect

        self._ = dict(
            detail=dict(),
            effect=effect,
            effects=effects,
        )

        if context:
            self._.update(context=context)
        if name:
            self._.update(name=name)
        if current is not ...:
            if isinstance(current, dict):
                current = _copy.deepcopy(current)
            self._.update(current=current, type=type(current))

    def __call__(self, *args, silent=False, **updates) -> "State":
        ##log("current before update:", current, trace="State.__call__")  ##
        ##log("previous before update:", self._.get("previous"), trace="State.__call__")  ##
        current = self._.get("current")
        if self.type and self.type is dict:
            # Abort if no updates
            if not updates:
                return self
            # XXX TODO Deal with value
            previous = self._.get("current")
            if not previous:
                # Init previous
                previous = {}
                self._["previous"] = previous
            change = {}
            for key, value in updates.items():
                if key in current:
                    # HACK ... deletes
                    if value is ...:
                        previous[key] = current[key]
                        current.pop(key)
                        change[key] = value
                    else:
                        if current[key] != value:
                            previous[key] = current[key]
                            current[key] = value
                            change[key] = value
                else:
                    if value is not ...:
                        previous[key] = current[key]
                        current[key] = value
                        change[key] = value
                self._['change'] = change

        else:
            # XXX TODO Deal with updates
            value = next(iter(args), None)
            value = copy(value)
            # Abort if no change
            if current == value:
                ##log("No change from:", value, trace="State.__call__")  ##
                return self
            # Update values
            self._.update(current=value, previous=current)

        ##log("current after update:", self.current, trace="State.__call__")  ##
        ##log("previous after update:", self.previous, trace="State.__call__")  ##
        # Init session
        if self.session is None:
            self._["session"] = 0
        if not silent:
            # Run effects
            self.effects()
        # Update session
        self._["session"] += 1
        return self

    @property
    def change(self):
        change = self._.get("change")
        return copy(change)

    @property
    def context(self):
        return self._.get("context")

    @property
    def current(self):
        current = self._.get("current")
        return copy(current)

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
        return copy(previous)

    @property
    def name(self) -> str:
        return self._.get("name", "")

    @property
    def session(self) -> str:
        return self._.get("session")

    @property
    def type(self) -> type:
        return self._.get("type")

    def detail(self, **updates) -> dict:
        """Updates and returns detail."""
        detail = self._["detail"]
        detail.update(updates)
        return detail
