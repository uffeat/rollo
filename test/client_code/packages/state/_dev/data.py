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

        ###
        # Enforce "no None-value" convention
        ##current = {k: v for k, v in current.items() if v is not None}
        ###

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
        _updates = next(iter(args), None)
        if _updates is not None:
            if isinstance(_updates, Data):
                _updates: dict = _updates.copy()
            else:
                _updates: dict = deepcopy(_updates)
        # Update current
        for key, value in updates.items():
            if value is None:
                # NOTE Convention: None removes
                current.pop(key, None)
            else:
                current[key] = value

        current.update(updates)
        return self

    def __contains__(self, key):
        current: dict = self._["current"]
        return key in current

    def __eq__(self, other) -> bool:
        current: dict = self._["current"]
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

        _current = Data(*args, **updates)
        _previous = Data()

        self._.update(
            _current=_current,
            _previous=_previous,
            change=Data().freeze(),
            current=Data(_current).freeze(),
            previous=Data().freeze(),
        )

    def __call__(self, *args, **updates) -> "State":
        """."""

        change = self.difference(updates)
        print("change:", change)

        if change:
            _current: Data = self._["_current"]
            _previous: Data = self._["_previous"]
            for key, value in change.items():
                _previous[key] = _current[key]
                if value is None:
                    _current.pop(key, None)
                else:
                    _current[key] = value

            # Update exposed
            self._.update(
                change=Data().freeze(change),
                current=Data(_current).freeze(_current),
                previous=Data().freeze(_previous),
            )

        return self

    @property
    def change(self) -> Data:
        """Returns items changed during most recent update."""
        return self._["change"]

    @property
    def current(self) -> Data:
        return self._["current"]

    @property
    def previous(self) -> Data:
        """Returns changed items as-was before most recent update."""
        return self._["previous"]

    def difference(self, other: dict) -> dict:
        """Returns items that are in other, but not in state."""
        _current: Data = self._["_current"]
        result = {}
        # NOTE Do not adapt to "no-None" value convention, since difference may be
        # used to trigger the "None removes" convention.
        for key, value in other.items():
            if key in _current:
                if value != _current[key]:
                    result[key] = value
            else:
                result[key] = value
        return result
