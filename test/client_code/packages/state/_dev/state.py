def log(*args, **kwargs):
    print(*args)


class Data:
    """Dict wrapper with JS-like syntax."""

    # NOTE Primarily intended for flat structures with immutable values.
    def __init__(self, data: dict, writable=False):
        self.__dict__.update(_=dict(data=data, writable=writable))

    def __bool__(self):
        return bool(len(self._["data"]))

    def __call__(self, **updates):
        if not self._.get("writable"):
            raise AttributeError("Read-only.")
        data: dict = self._["data"]
        for key, value in updates.items():
            if value is None:
                data.pop(key, None)
            else:
                data[key] = value
        return self

    def __contains__(self, key: str):
        return key in self._["data"]

    def __eq__(self, other) -> bool:
        return self._["data"] == other

    def __getattr__(self, key: str):
        return self[key]

    def __getitem__(self, key: str):
        return self._["data"].get(key)

    def __iter__(self) -> iter:
        return iter(self._["data"].items())

    def __len__(self) -> int:
        return len(self._["data"])

    def __setattr__(self, key: str, value):
        self(**{key: value})

    def __setitem__(self, key: str, value):
        self(**{key: value})

    def __str__(self):
        return str(self._["data"])

    def items(self):
        return self._["data"].items()

    def get(self, key: str, *args):
        default = next(iter(args), None)
        return self._["data"].get(key, default)

    def keys(self):
        return self._["data"].keys()

    def values(self):
        return self._["data"].values()


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

    def __getitem__(self, key: str):
        """Returns declared attribute."""
        return getattr(self, key, None)

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
        self,
        effect: callable,
        once: bool = False,
        protected: bool = False,
        run: bool = False,
        **data,
    ) -> callable:
        # Create detail
        detail = dict(data=Data(data, writable=True))
        # Handle ii effect
        if run:
            transient = dict()
            message = Message(
                owner=self.owner,
                # Signal non-reactive invocation:
                session=None,
                transient=transient,
            )
            # Update transient part of message
            transient.update(effect=effect, detail=detail)
            ##log("Running effect before registration", trace="Effects.add")  ##
            effect(message)
            if once:
                ##log("Not registering effect.", trace="Effects.add")  ##
                return effect
        # Update detail
        if once:
            detail.update(once=once)
        if protected:
            detail.update(protected=protected)
        if effect in self:
            # Dedupe effect, but update detail
            self.update(**detail)
        else:
            # Register
            self.registry[effect] = detail
            ##log("Registered effect with detail:", detail, trace="Effects.add")  ##
        # Return effect to facilitate removal
        return effect

    def clear(self, force=False) -> None:
        if force:
            self.registry.clear()
        else:
            remove = []
            # Run effects
            for effect, detail in self:
                protected = detail.get("protected")
                if protected:
                    continue
                remove.append(effect)
            for effect in remove:
                self.remove(effect)

    def get(self, effect: callable, *args) -> dict:
        """Returns detail associated with effect."""
        default = next(iter(args), None)
        detail = self.registry.get(effect, default)
        return detail

    def has(self, effect: callable) -> bool:
        return effect in self.registry
    
    def index(self, effect: callable) -> int:
        if effect in self.registry:
            keys = list(self.registry.keys())
            return keys.index(effect)

    def remove(self, effect: callable) -> None:
        self.registry.pop(effect, None)

    def update(self, effect: callable, *updates) -> None:
        """Updates detail associated with effect."""
        detail = self.get(effect)
        if not isinstance(detail, dict):
            raise KeyError("Cannot update detail for non-registered effect.")
        detail.update(updates)


class Message:
    """Argument for effects."""

    # NOTE Inspired by web events

    @classmethod
    def keys(cls) -> list:
        """Returns own property names."""
        return [
            k
            for k, v in cls.__dict__.items()
            if not k.startswith("__")
            and not k.endswith("__")
            and isinstance(v, property)
        ]

    def __init__(self, owner=None, session=None, transient: dict = None):
        # HACK Consumer passes in 'transient' to provide pseudo-encapsulation
        self._ = dict(
            data=Data({}, writable=True),
            owner=owner,
            transient=transient,
        )
        if session is None:
            self._.update(session=session)

    @property
    def change(self):
        # NOTE Already accessible via 'owner', but provided for convenience.
        return self.owner.change

    @property
    def current(self):
        # NOTE Already accessible via 'owner', but provided for convenience.
        return self.owner.current

    @property
    def data(self) -> Data:
        """Returns data."""
        # NOTE Belongs to message. Useful for inter-effect coms.
        return self._["data"]

    @property
    def detail(self) -> dict:
        # NOTE Belongs to effect
        transient: dict = self._["transient"]
        return transient.get("detail")

    @property
    def effect(self) -> callable:
        transient: dict = self._["transient"]
        return transient.get("effect")

    @property
    def index(self) -> int:
        # NOTE Belongs to effect
        transient: dict = self._["transient"]
        return transient.get("index")

    @property
    def owner(self) -> "State":
        return self._["owner"]

    @property
    def previous(self):
        # NOTE Already accessible via 'owner', but provided for convenience.
        return self.owner.previous

    @property
    def session(self) -> int:
        if "session" in self._:
            return self._["session"]
        return self.owner.session


class Ref:
    """Reactive state tool for single value."""

    @classmethod
    def keys(cls) -> list:
        """Returns own property names."""
        return [
            k
            for k, v in cls.__dict__.items()
            if not k.startswith("__")
            and not k.endswith("__")
            and isinstance(v, property)
        ]

    def __init__(self, *args, context=None, name: str = "", **detail):
        current = next(iter(args), None)
        owner = self
        effects = Effects(owner=self)

        class effect:
            def __init__(self, **kwargs):
                self.kwargs = kwargs

            def __call__(self, effect: callable) -> callable:
                effects.add(effect, **self.kwargs)
                return effect

        class match:
            def __init__(self):
                """."""
                # XXX Keep for future use.

            def __call__(self, matches: callable) -> callable:
                owner._.update(matches=matches)

        def matches(value, other):
            return value == other

        self._ = dict(
            current=current,
            detail=Data(detail, writable=True),
            effect=effect,
            effects=effects,
            match=match,
            matches=matches,
            previous=None,
        )
        if context:
            self._.update(context=context)
        if name:
            self._.update(name=name)

    def __bool__(self):
        return bool(self.current)

    def __call__(self, value, silent=False, **updates) -> "Ref":
        self.detail(**updates)
        if self.current != value:
            self._["previous"] = self.current
            self._["current"] = value
            # Init session
            if self.session is None:
                self._["session"] = 0
            if not silent:
                # Run effects
                self.effects()
            # Update session
            self._["session"] += 1
        return self

    def __eq__(self, other) -> bool:
        matches = self._["matches"]
        return matches(self.current, other)

    def __str__(self):
        return str(self.current)

    @property
    def change(self):
        """."""
        return self.previous

    @property
    def context(self):
        return self._.get("context")

    @property
    def current(self):
        return self._["current"]

    @property
    def detail(self) -> Data:
        # NOTE Useful for storing non-reactive additional data
        return self._["detail"]

    @property
    def effect(self) -> callable:
        """Decorates effect."""
        return self._["effect"]

    @property
    def effects(self) -> Effects:
        """Returns effects controller."""
        return self._["effects"]

    @property
    def match(self) -> callable:
        """Decorates match function."""
        return self._["match"]

    @property
    def previous(self):
        """Returns changed items as-was before most recent update."""
        return self._["previous"]

    @property
    def name(self) -> str:
        return self._.get("name", "")

    @property
    def session(self) -> str:
        return self._.get("session")


class State:
    """Reactive state tool.
    NOTE
    - Primarily intended for flat structures with immutable values.
    - Can be used as effect for other State instances, therefore no critical need
      for implementing filter, reducer and transformer features.
    """

    @classmethod
    def keys(cls) -> list:
        """Returns own property names."""
        return [
            k
            for k, v in cls.__dict__.items()
            if not k.startswith("__")
            and not k.endswith("__")
            and isinstance(v, property)
        ]

    def __init__(self, *args, context=None, detail: dict = None, name: str = ""):
        current = next(iter(args), {})
        if not isinstance(current, dict):
            raise TypeError(f"Expected dict. Got: {str(current)}.")
        if detail is None:
            detail = {}
        elif not isinstance(detail, dict):
            raise TypeError(f"Expected dict. Got: {str(detail)}.")

        owner = self
        effects = Effects(owner=self)

        class effect:
            def __init__(self, **kwargs):
                self.kwargs = kwargs

            def __call__(self, effect: callable) -> callable:
                effects.add(effect, **self.kwargs)
                return effect

        class match:
            def __init__(self):
                """."""
                # XXX Keep for future use.

            def __call__(self, matches: callable) -> callable:
                owner._.update(matches=matches)

        def matches(value, other):
            return value == other

        _ = dict(
            _=dict(
                change=Data({}),
                current=Data(current),
                previous=Data({}),
            ),
            current=current,
            detail=Data(detail, writable=True),
            effect=effect,
            effects=effects,
            match=match,
            matches=matches,
            previous={},
        )
        if context:
            _.update(context=context)

        if name:
            _.update(name=name)

        self.__dict__["_"] = _

    def __bool__(self):
        return bool(len(self._["current"]))

    def __call__(self, *args, silent=False, **updates) -> "State":
        # XXX 'updates' should not contain a 'silent' key
        current = next(iter(args), ...)
        if current is not ...:
            if current is None:
                current = {}
            elif not isinstance(current, dict):
                raise TypeError(f"Expected dict. Got: {str(current)}.")
            # current provided as pos arg -> reset current
            self._["current"] = current
            previous = {}
            self._["previous"] = previous
            change = {}
        else:
            current: dict = self._["current"]
            previous: dict = self._["previous"]
            if updates:
                matches = self._["matches"]
                change = {}
                for key, value in updates.items():
                    if key in current:
                        # HACK None deletes
                        if value is None:
                            previous[key] = current[key]
                            current.pop(key)
                            change[key] = value
                        else:
                            if not matches(current[key], value):
                                previous[key] = current[key]
                                current[key] = value
                                change[key] = value
                    else:
                        # New key
                        if value is not None:
                            current[key] = value
                            change[key] = value
            else:
                # No updates -> clear
                previous.clear()
                previous.update(current)
                change = dict(current)
                current.clear()
        # Create public exposures
        self._["_"].update(
            change=Data(change), current=Data(current), previous=Data(previous)
        )
        # Init session
        if self.session is None:
            self._["session"] = 0
        if not silent:
            # Run effects
            self.effects()
        # Update session
        self._["session"] += 1
        return self

    def __contains__(self, key: str):
        return key in self._["current"]

    def __eq__(self, other) -> bool:
        return self._["current"] == other

    def __getattr__(self, key: str):
        return self[key]

    def __getitem__(self, key: str):
        return self._["current"].get(key)

    def __iter__(self) -> iter:
        return iter(self._["current"].items())

    def __setattr__(self, key: str, value):
        """."""
        self(**{key: value})

    def __setitem__(self, key: str, value):
        """."""
        self(**{key: value})

    def __str__(self):
        return str(self._["current"])

    @property
    def change(self):
        """Returns items changed during most recent update."""
        return self._["_"]["change"]

    @property
    def context(self):
        return self._.get("context")

    @property
    def current(self):
        return self._["_"]["current"]

    @property
    def detail(self) -> Data:
        # NOTE Useful for storing non-reactive additional data
        return self._["detail"]

    @property
    def effect(self) -> callable:
        """Decorates effect."""
        return self._["effect"]

    @property
    def effects(self) -> Effects:
        """Returns effects controller."""
        return self._["effects"]

    @property
    def match(self) -> callable:
        """Decorates match function."""
        return self._["match"]

    @property
    def previous(self):
        """Returns changed items as-was before most recent update."""
        return self._["_"]["previous"]

    @property
    def name(self) -> str:
        return self._.get("name", "")

    @property
    def session(self) -> str:
        return self._.get("session")

    def clear(self, silent=False) -> "State":
        """Clears items reactively."""
        updates = {k: None for k in self.keys()}
        self(silent=silent, **updates)
        return self

    def items(self):
        return self._["current"].items()

    def keys(self):
        return self._["current"].keys()

    def reset(self, **current):
        return self(current)

    def values(self):
        return self._["current"].values()
