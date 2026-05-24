from copy import deepcopy
from types import MappingProxyType


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


class Base:
    @classmethod
    def keys(cls) -> tuple:
        """Returns unique property names."""
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
        return tuple(set(result))

    def __init__(self):
        # NOTE Add to '__dict__' to enable '__setattr__'
        self.__dict__.update(__={})

    @property
    def _(self) -> dict:
        return self.__


class Data(Base):
    """."""

    def __init__(self, *args, **current):
        Base.__init__(self)
        _current = next(iter(args), None)
        if _current is not None:
            if isinstance(_current, Data):
                _current: dict = _current.copy()
            else:
                _current: dict = deepcopy(_current)
            current.update(**_current)
        # NOTE Do not enforce "no None-value" convention
        self._.update(current=current)

    def __bool__(self):
        current: dict = self._["current"]
        return bool(len(current))

    def __call__(self, *args, **updates) -> "Data":
        """."""
        frozen: bool = self._.get("frozen", False)
        if frozen:
            raise AttributeError("Frozen")
        current: dict = self._["current"]
        # Handle pos arg updates
        _updates = next(iter(args), ...)
        if _updates is None:
            return self.clear()
        if _updates is not ...:
            if isinstance(_updates, Data):
                _updates: dict = _updates._["current"]
            updates.update(_updates)
        updates: dict = deepcopy(updates)
        # Update current
        for key, value in updates.items():
            if value is None:
                # NOTE Convention: None-value removes
                current.pop(key, None)
            else:
                current[key] = value
        return self

    def __contains__(self, key):
        current: dict = self._["current"]
        return key in current

    def __eq__(self, other) -> bool:
        current: dict = self._["current"]
        if isinstance(other, Data):
            other: dict = other._["current"]
        return other == current

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        current: dict = self._["current"]
        return current.get(key)

    def __iter__(self):
        current: dict = self._["current"]
        return iter(current.items())

    def __len__(self) -> int:
        current: dict = self._["current"]
        return len(current)

    def __ne__(self, other) -> bool:
        current: dict = self._["current"]
        if isinstance(other, Data):
            other: dict = other._["current"]
        return other != current

    def __setattr__(self, key, value):
        self(**{key: value})

    def __setitem__(self, key, value):
        self(**{key: value})

    def __str__(self) -> str:
        current: dict = self._["current"]
        return str(current)

    def clear(self) -> "Data":
        updates = {k: None for k in self.keys()}
        # NOTE All changes channeled through __call__
        self(**updates)
        return self

    def copy(self, deep: bool = True) -> dict:
        current: dict = self._["current"]
        if deep:
            return deepcopy(current)
        return current.copy()

    def freeze(self) -> "Data":
        """."""
        self._.update(frozen=True)
        return self

    def get(self, key, *args):
        current: dict = self._["current"]
        default = next(iter(args), None)
        return current.get(key, default)

    def index(self, key) -> int:
        """Returns item index. Returns None if key does not exist."""
        current: dict = self._["current"]
        if key in current:
            keys = list(current.keys())
            return keys.index(key)

    def items(self):
        current: dict = self._["current"]
        return current.items()

    def keys(self):
        current: dict = self._["current"]
        return current.keys()

    def pop(self, key, *args):
        if key in self:
            value = self[key]
            self(**{key: None})
            return value
        return next(iter(args), None)

    def values(self):
        current: dict = self._["current"]
        return current.values()


class State(Base):
    """."""

    def __init__(self, *args, **updates):
        Base.__init__(self)

        _capabilities = Data()
        _config = Data()
        _current = Data(*args, **updates)

        class capability:
            def __init__(self, *args, **kwargs):
                self.args = args

            def __call__(self, handler: callable) -> callable:
                name = next(iter(self.args), handler.__name__)
                _capabilities[name] = handler
                ##print("Registered capability:", name)  ##
                return handler

        @capability()
        def matches(value, other):
            return value == other

        self._.update(
            _capabilities=_capabilities,
            _config=_config,
            _current=_current,
            capability=capability,
            change=Data().freeze(),
            current=Data(_current).freeze(),
            detail=Data(),
            previous=Data().freeze(),
        )

    def __call__(self, *args, **updates) -> "State":
        """Updates current."""
        # Handle pos arg updates
        _updates = next(iter(args), ...)
        if _updates is None:
            return self.clear()
        if _updates is not ...:
            if isinstance(_updates, State):
                _updates: dict = _updates._["_current"]._["current"]
            elif isinstance(_updates, Data):
                _updates: dict = _updates._["current"]
            updates.update(_updates)
        updates: dict = deepcopy(updates)
        # Infer change
        change = self.difference(updates)
        ##print("change:", change)  ##
        if change:
            # Handle session
            if self.session is None:
                # Init session
                self._["session"] = 0
            else:
                # Update session
                self._["session"] += 1
            # Get private current
            _current: Data = self._["_current"]
            # Update previous
            self._.update(
                previous=Data(_current).freeze(),
            )
            # Update private current
            _current(change)

            # Update change and public current
            self._.update(
                change=Data(change).freeze(),
                current=Data(_current).freeze(),
            )
            ##print("_current after change:", _current)  ##
        else:
            ...
        return self

    def __bool__(self):
        current: Data = self._["_current"]
        return bool(current)

    def __contains__(self, key):
        current: Data = self._["_current"]
        return key in current

    def __eq__(self, other) -> bool:
        return not bool(self.difference(other))
    
    def __getitem__(self, key):
        current: Data = self._["_current"]
        return current[key]

    def __iter__(self):
        current: Data = self._["_current"]
        return iter(current)

    def __len__(self) -> int:
        current: Data = self._["_current"]
        return len(current)

    def __ne__(self, other) -> bool:
        return bool(self.difference(other))
    
    def __setitem__(self, key, value):
        self(**{key: value})

    def __str__(self) -> str:
        current: Data = self._["_current"]
        return str(current)

    @property
    def capability(self) -> callable:
        """Decorates capability."""
        return self._["capability"]

    @property
    def change(self) -> Data:
        """Returns changes from most recent update."""
        return self._["change"]

    @property
    def context(self):
        _config: Data = self._["_config"]
        return _config.get("context")

    @property
    def current(self) -> Data:
        return self._["current"]

    @property
    def detail(self) -> Data:
        # NOTE Useful for storing non-reactive additional data
        return self._.get("detail")

    @property
    def name(self) -> str:
        _config: Data = self._["_config"]
        return _config.get("name", "")

    @property
    def previous(self) -> Data:
        """Returns current as-was before most recent update."""
        return self._["previous"]

    @property
    def session(self) -> int:
        return self._.get("session")

    def clear(self) -> "State":
        """Clears current reactively."""
        updates = {k: None for k in self.keys()}
        self(**updates)
        return self

    def config(self, **updates) -> "State":
        """Updates config."""
        if updates:
            _config: Data = self._["_config"]
            _config(updates)
        return self
    
    def copy(self, deep: bool = True) -> dict:
        _current: Data = self._["_current"]
        return _current.copy(deep=deep)

    def difference(self, other: dict) -> dict:
        """Returns items that are in other, but not in current."""
        if isinstance(other, State):
            other: dict = other._["_current"]._["current"]
        elif isinstance(other, Data):
            other: dict = other._["current"]
        _current: Data = self._["_current"]
        _capabilities: Data = self._["_capabilities"]
        matches = _capabilities.get("matches")
        result = {}
        # NOTE Do not adapt to "no-None" value convention, since difference may be
        # used to trigger the "None removes" convention.
        for key, value in other.items():
            if key in _current:
                if not matches(_current[key], value):
                    result[key] = value
            else:
                result[key] = value
        return result
    
    def get(self, key, *args):
        _current: Data = self._["_current"]
        return _current.get(key, *args)

    def index(self, key) -> int:
        """Returns item index. Returns None if key does not exist."""
        _current: Data = self._["_current"]
        return _current.index(key)

    def items(self):
        _current: Data = self._["_current"]
        return _current.items()

    def keys(self):
        _current: Data = self._["_current"]
        return _current.keys()

    def pop(self, key, *args):
        if key in self:
            value = self[key]
            self(**{key: None})
            return value
        return next(iter(args), None)

    def values(self):
        _current: Data = self._["_current"]
        return _current.values()

    
