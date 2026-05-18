from copy import deepcopy


def log(*args, **kwargs):
    print(*args)


def Dict(sequence: list) -> dict:
    """Returns dict from items sequence."""
    if isinstance(sequence, (list, tuple)):
        result = {}
        for item in sequence:
            if isinstance(item, (list, tuple)) and len(item) == 2:
                key, value = item
                result[key] = value
        return result


class instantiate:

    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def __call__(self, target: callable):
        if "__init__" in target.__dict__:
            return target(*self.args, **self.kwargs)
        return target()


class Data:
    """Dict wrapper with enhanced features, some inspired by JS Map and JS (plain) Object.
    NOTE
    Intended for flat structures with immutable values, but can
    be used for other cases.
    """

    def __init__(self, *args, writable=False, **data):
        _data = next(iter(args), None)
        if _data is not None:
            # Create from pos arg
            if isinstance(_data, Data):
                _data = _data.copy()
            else:
                if not isinstance(_data, dict):
                    raise TypeError(f"Cannot create from: {str(_data)}.")
                _data = deepcopy(_data)
            data.update(_data)
        # Create private state
        _ = dict(data=data)
        # NOTE Add '_' to '__dict__' to enable '__setattr__'
        self.__dict__.update(_=_)
        if writable:
            _.update(writable=True)

    def __bool__(self):
        return bool(len(self.data))

    def __call__(self, *args, **updates):
        if not self.writable:
            raise AttributeError("Read-only.")
        _updates = next(iter(args), None)
        if _updates is not None:
            # Update from pos arg
            if isinstance(_updates, Data):
                _updates = _updates.copy()
            else:
                if not isinstance(_updates, dict):
                    raise TypeError(f"Cannot update from: {str(_updates)}.")
                _updates = deepcopy(_updates)
            updates.update(_updates)
        for key, value in updates.items():
            if value is None:
                # NOTE Convention: None removes
                self.data.pop(key, None)
            else:
                self.data[key] = value
        return self

    def __contains__(self, key):
        return key in self.data

    def __eq__(self, other) -> bool:
        if isinstance(other, Data):
            other = other.data
        return self.data == other

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self.data.get(key)

    def __iter__(self):
        return iter(self.data.items())

    def __len__(self) -> int:
        return len(self.data)

    def __setattr__(self, key, value):
        self(**{key: value})

    def __setitem__(self, key, value):
        self(**{key: value})

    def __str__(self):
        return str(self.data)

    @property
    def data(self) -> dict:
        """Returns wrapped data.
        NOTE
        Should only be accessed externally in special cases (circumvents
        any write protection).
        """
        return self._["data"]

    @property
    def size(self) -> int:
        """Returns number of items."""
        return len(self.data)

    @property
    def writable(self) -> bool:
        return self._.get("writable", False)

    def clear(self) -> "Data":
        if not self.writable:
            raise AttributeError("Read-only.")
        self.data.clear()
        return self

    def clone(self) -> "Data":
        return Data(self)

    def copy(self, deep: bool = True) -> dict:
        if deep:
            return deepcopy(self.data)
        return self.data.copy()

    def has(self, key) -> bool:
        return key in self.data

    def index(self, key) -> int:
        if key in self.data:
            keys = list(self.data.keys())
            return keys.index(key)

    def items(self):
        return self.data.items()

    def get(self, key, *args):
        default = next(iter(args), None)
        return self.data.get(key, default)

    def keys(self):
        return self.data.keys()

    def pop(self, key, *args):
        default = next(iter(args), None)
        return self.data.pop(key, default)

    def update(self, *args, **kwargs):
        return self(*args, **kwargs)

    def values(self):
        return self.data.values()


class Effects:
    def __init__(self, owner: "Base"):
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

    def __iter__(self):
        """Returns iterator for registry."""
        return iter(self.registry.items())

    def __len__(self) -> int:
        """Returns number of registered effects."""
        return len(self.registry)

    @property
    def max(self) -> int:
        """Returns number of allowed effects. None means no limit."""
        return self._.get("max")

    @max.setter
    def max(self, max: int):
        """Sets number of allowed effects. None means no limit."""
        # NOTE Useful during dev to guard against memory leaks.
        if max is None:
            self._.pop("max", None)
        else:
            self._["max"] = max

    @property
    def owner(self) -> "Base":
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
        ##detail = dict(data=Data(data, writable=True))
        detail = Data(data=Data(data, writable=True), writable=True)
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
            if self.max and self.size >= self.max:
                raise ValueError(f"Cannot register more than {self.max} effects.")

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
            and len(k) > 2
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
    def change(self) -> Data:
        # NOTE Already accessible via 'owner', but provided for convenience.
        return self.owner.change

    @property
    def current(self) -> Data:
        # NOTE Already accessible via 'owner', but provided for convenience.
        return self.owner.current

    @property
    def data(self) -> Data:
        """Returns data."""
        # NOTE Belongs to message. Useful for inter-effect coms.
        return self._["data"]

    @property
    def detail(self) -> Data:
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
    def owner(self):
        return self._["owner"]

    @property
    def previous(self) -> Data:
        # NOTE Already accessible via 'owner', but provided for convenience.
        return self.owner.previous

    @property
    def session(self) -> int:
        if "session" in self._:
            return self._["session"]
        return self.owner.session


class Base:
    """Base for reactive tools."""

    @classmethod
    def keys(cls) -> list:
        """Returns own property names."""
        result = []
        for c in cls.mro():
            _keys = [
                k
                for k, v in c.__dict__.items()
                if not k.startswith("__")
                and not k.endswith("__")
                and len(k) > 2
                and isinstance(v, property)
            ]
            result.extend(_keys)
        return list(set(result))

    def __init__(self, context=None, tag: str = "", **detail):
        owner = self
        effects = Effects(self)

        class effect:
            def __init__(self, **kwargs):
                self.kwargs = kwargs

            def __call__(self, effect: callable) -> callable:
                effects.add(effect, **self.kwargs)
                return effect

        class match:
            def __init__(self):
                """XXX For future use."""

            def __call__(self, matches: callable) -> callable:
                owner._.update(matches=matches)

        def matches(value, other):
            return value == other

        _ = dict(
            detail=Data(detail, writable=True),
            effect=effect,
            effects=effects,
            match=match,
            matches=matches,
        )
        if context:
            _.update(context=context)
        if tag:
            _.update(tag=tag)
        self.__dict__["_"] = _

    def __eq__(self, other) -> bool:
        if isinstance(other, Data):
            other = other.data
        elif isinstance(other, Ref):
            other = other.current
        elif isinstance(other, State):
            other = other.data
        matches = self._["matches"]
        return matches(self.data, other)
    
    def __str__(self):
        return str(self.data)

    @property
    def context(self):
        return self._.get("context")

    @property
    def data(self):
        """Returns current as-is.
        NOTE Should only be accessed externally in special cases."""
        return self._.get("current")

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
    def session(self) -> int:
        return self._.get("session")

    @property
    def tag(self) -> str:
        return self._.get("tag", "")


class Ref(Base):
    """Reactive state tool for single value."""

    def __init__(self, *args, context=None, tag: str = "", **detail):
        Base.__init__(self, context=context, tag=tag, **detail)
        current = next(iter(args), None)

        if isinstance(current, Data):
            current = current.copy()
        elif isinstance(current, State):
            current = current.copy()

        self._.update(current=current, previous=None)
        if context:
            self._.update(context=context)
        if tag:
            self._.update(tag=tag)

    def __bool__(self):
        return bool(self.current)

    def __call__(self, value, silent=False, **detail) -> "Ref":
        self.detail(**detail)
        if isinstance(value, Data):
            value = value.copy()
        elif isinstance(value, Message):
            value = value.owner.copy()
        elif isinstance(value, Ref):
            value = value.current
        elif isinstance(value, State):
            value = value.copy()

        matches = self._["matches"]
        if not matches(self.current, value):
            self._.update(previous=self.current, current=value)
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
    def change(self) -> Data:
        """."""
        # For alignment with 'State'
        return self.current
    
    
    @property
    def current(self):
        return self._["current"]

    @property
    def previous(self):
        """Returns changed items as-was before most recent update."""
        return self._["previous"]


class State(Base):
    """Reactive state tool.
    NOTE
    - Primarily intended for flat structures with immutable values.
    """

    def __init__(
        self, *args, context=None, detail: dict = None, tag: str = "", **current
    ):
        if detail is None:
            detail = {}
        Base.__init__(self, context=context, tag=tag, **detail)

        _current = next(iter(args), None)
        if _current is not None:
            # Create from pos arg
            if isinstance(_current, Data):
                _current = _current.copy()
            elif isinstance(_current, Ref):
                _current = _current.current
            elif isinstance(_current, State):
                _current = _current.copy()
            else:
                if not isinstance(_current, dict):
                    raise TypeError(f"Cannot create from: {str(_current)}.")
                _current = deepcopy(_current)
            current.update(_current)

        _ = dict(
            change=Data({}),
            current=Data(current),
            previous=Data({}),
        )
        self._.update(_=_, current=current, previous={})

    def __bool__(self):
        return bool(len(self.data))

    def __call__(self, *args, silent=False, **updates) -> "State":
        # XXX 'updates' should not contain a 'silent' key
        _updates = next(iter(args), None)
        if _updates is not None:
            # Update from pos arg
            if isinstance(_updates, Data):
                _updates = _updates.copy()
            elif isinstance(_updates, Message):
                _updates = _updates.owner.copy()
            elif isinstance(_updates, Ref):
                _updates = _updates.current
            elif isinstance(_updates, State):
                _updates = _updates.copy()
            else:
                if not isinstance(_updates, dict):
                    raise TypeError(f"Cannot update from: {str(_updates)}.")
                _updates = deepcopy(_updates)
            updates.update(_updates)
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

    def __contains__(self, key):
        return key in self.data

    

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self.data.get(key)

    def __iter__(self) -> iter:
        return iter(self.data.items())
    
    def __len__(self) -> int:
        return len(self.data)

    def __setattr__(self, key, value):
        self(**{key: value})

    def __setitem__(self, key, value):
        self(**{key: value})

    @property
    def change(self) -> Data:
        """Returns items changed during most recent update."""
        return self._["_"]["change"]

    @property
    def current(self) -> Data:
        return self._["_"]["current"]

    @property
    def previous(self) -> Data:
        """Returns changed items as-was before most recent update."""
        return self._["_"]["previous"]

    @property
    def size(self) -> int:
        """Returns number of items."""
        return len(self.data)

    def clear(self, silent=False) -> "State":
        """Clears items reactively."""
        updates = {k: None for k in self.keys()}
        self(silent=silent, **updates)
        return self

    def clone(self) -> "State":
        return State(self)

    def copy(self, deep: bool = True) -> dict:
        if deep:
            return deepcopy(self.data)
        return self.data.copy()

    def get(self, key, *args):
        default = next(iter(args), None)
        return self.data.get(key, default)

    def has(self, key) -> bool:
        return key in self.data

    def index(self, key) -> int:
        if key in self.data:
            keys = list(self.data.keys())
            return keys.index(key)

    def items(self):
        return self.data.items()

    def keys(self):
        return self.data.keys()

    def pop(self, key, *args):
        if key in self.data:
            value = self.data[key]
            self(**{key: None})
        else:
            value = next(iter(args), None)
        return value

    def reset(self, **current):
        return self(current)

    def update(self, *args, **kwargs):
        return self(*args, **kwargs)

    def values(self):
        return self.data.values()
