import copy as _copy
from types import MappingProxyType


def log(*args, **kwargs):
    print(*args)


def copy(value):
    """Returns deep copy of value if mutable else value."""
    if isinstance(value, (dict, list, tuple)):
        return _copy.deepcopy(value)
    return value


class Data:
    def __init__(self, _: dict):
        self.__dict__["_"] = _

    def __bool__(self):
        return bool(len(self._))

    def __contains__(self, key: str):
        return key in self._

    def __eq__(self, other) -> bool:
        return self._ == other

    def __getattr__(self, key: str):
        return self[key]

    def __getitem__(self, key: str):
        return self._.get(key)

    def __iter__(self) -> iter:
        return iter(self._.items())

    def __len__(self) -> int:
        return len(self._)

    def __str__(self):
        return str(self._)

    def items(self):
        return self._.items()

    def get(self, key: str, *args):
        default = next(iter(args), None)
        return self._.get(key, default)

    def keys(self):
        return self._.keys()

    def values(self):
        return self._.values()


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
        **data
    ) -> callable:
        # Create detail
        detail = dict(data=data)
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

    def remove(self, effect: callable) -> None:
        self.registry.pop(effect, None)

    def update(self, effect: callable, *updates) -> None:
        """Updates detail associated with effect."""
        detail = self.get(effect)
        if not isinstance(detail, dict):
            raise KeyError("Cannot update detail for non-registered effect.")
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
    def previous(self):
        return self.owner.previous

    @property
    def session(self) -> int:
        if "session" in self._:
            return self._["session"]
        return self.owner.session

    def data(self, **updates) -> dict:
        """Updates and returns data."""
        # NOTE Belongs to message
        data: dict = self._["data"]
        data.update(data)
        return data


class State:
    """Reactive state tool."""

    def __init__(self, context=None, name: str = ""):
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

            def __call__(self, matches: callable) -> callable:
                owner._.update(matches=matches)

        def matches(value, other):
            return value == other

        self._ = dict(
            _=dict(),
            detail=dict(),
            effect=effect,
            effects=effects,
            match=match,
            matches=matches,
        )
        if context:
            self._.update(context=context)
        if name:
            self._.update(name=name)

    def __bool__(self):
        current = self._.get("current")
        if current is None:
            return False
        return bool(len(current))
    
    def __call__(self, *args, silent=False, **updates) -> "State":
        current = self._.get("current")
        if current is None:
            current = {}
            self._["current"] = current
        
        # XXX TODO Handle args

        # Abort if no updates
        if not updates:
            return self
        
        
        
        matches = self._["matches"]
        previous = self._.get("previous")
        if previous is None:
            previous = {}
            self._["previous"] = previous
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
        # Create public exposures
        self._["change"] = Data(change)
        self._["_"]["current"] = Data(current)
        self._["_"]["previous"] = Data(previous)
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
        current = self._.get("current")
        if current is None:
            return False
        return key in current
    
    def __eq__(self, other) -> bool:
        current = self._.get("current")
        return current == other

    def __getattr__(self, key: str):
        return self[key]

    def __getitem__(self, key: str):
        current = self._.get("current")
        if current is not None:
            return current.get(key)
        
    def __iter__(self) -> iter:
        current = self._.get("current")
        if current is not None:
            return iter(current.items())

    def __str__(self):
        return str(self._.get("current"))

    @property
    def change(self):
        """Returns items changed during most recent update."""
        return self._.get("change")

    @property
    def context(self):
        return self._.get("context")

    @property
    def current(self):
        return self._["_"].get("current")

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
        return self._["_"].get("previous")

    @property
    def name(self) -> str:
        return self._.get("name", "")

    @property
    def session(self) -> str:
        return self._.get("session")

    def clear(self, silent=False) -> "State":
        """."""
        keys = self.keys()
        if keys:
            updates = {k: None for k in self.keys()}
            self(silent=silent, **updates)
        return self

    def detail(self, **updates) -> dict:
        """Updates and returns detail."""
        detail = self._["detail"]
        detail.update(updates)
        return detail

    def items(self):
        current = self._.get("current")
        if current is not None:
            return current.items()

    def keys(self):
        current = self._.get("current")
        if current is not None:
            return current.keys()

    def values(self):
        current = self._.get("current")
        if current is not None:
            return current.values()
