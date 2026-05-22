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

    def __init__(self):
        # NOTE Add to '__dict__' to enable '__setattr__'
        self.__dict__.update(__={})

    @property
    def _(self) -> dict:
        return self.__
    


class View(Base):
    """."""

    def __init__(self, *args, **current):
        Base.__init__(self)
        

        
        # Enforce "no None-value" convention
        current = {k: v for k, v in current.items() if v is not None}

        

        
        self._.update(current=current)

    def __bool__(self):
        return bool(len(self.current))

    
    def __contains__(self, key):
        return key in self.current

    def __eq__(self, other) -> bool:




        if isinstance(other, Data):
            other = other.current
        elif not isinstance(other, dict):
            return False
        # Enforce "no None-value" convention
        other = {k: v for k, v in other.items() if v is not None}


        match = self._.get("_match")
        if match:
            if len(self) != len(other):
                return False
            for key, value in self:
                if key not in other:
                    return False
                if not match(value, other[key]):
                    return False
            return True
        
        
        
        return self.current == other

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self.current.get(key)

    def __iter__(self):
        return iter(self.current.items())

    def __len__(self) -> int:
        return len(self.current)

    def __rsub__(self, other):
        return self.difference(other)

    def __setattr__(self, key, value):
        self(**{key: value})

    def __setitem__(self, key, value):
        self(**{key: value})

    def __str__(self):
        return str(self.current)

    @property
    def current(self) -> dict:
        # NOTE Should only be accessed externally in special cases.
        return self._["current"]

    def __sub__(self, other):
        return self.difference(other, flip=True)

    @property
    def match(self) -> callable:
        """Returns decorator for value-level match function."""
        return self._["match"]

    @property
    def size(self) -> int:
        """Returns number of items."""
        return len(self)

    @property
    def writable(self) -> bool:
        return self._.get("writable", False)

    def clear(self) -> "Data":
        if not self.writable:
            raise AttributeError("Read-only.")
        updates = {k: None for k in self.keys()}
        # NOTE All changes channeled through __call__
        self(**updates)
        return self

    def clone(self) -> "Data":
        return Data(self)

    def config(self, writable=True) -> "Data":
        if writable:
            self._["writable"] = True
        else:
            self._.pop("writable", None)
        return self

    def copy(self, deep: bool = True) -> dict:
        if deep:
            return deepcopy(self.current)
        return self.current.copy()

    def difference(self, other: dict, flip=False):
        """Not flipped: Returns items that are in other, but not in data.
        Flipped: Returns items that are in data, but not in other."""
        if isinstance(other, Data):
            other = other.current
        if not isinstance(other, dict):
            raise TypeError(f"Cannot infer difference with respect to: {str(other)}.")
        match = self._.get("_match") or (lambda value, other: value == other)
        result = {}
        if flip:
            for key, value in self:
                if key in other:
                    if not match(value, other[key]):
                        result[key] = value
                else:
                    result[key] = value
            return result
        # NOTE Do not adapt to "no-None" value convention, since difference may be
        # used to trigger the "None removes" convention.
        for key, value in other.items():
            if key in self:
                if not match(value, self[key]):
                    result[key] = value
            else:
                result[key] = value
        return result

    def has(self, key) -> bool:
        return key in self

    def index(self, key) -> int:
        """Returns item index. Returns None if key does not exist."""
        if key in self.current:
            keys = list(self.current.keys())
            return keys.index(key)

    def items(self):
        return self.current.items()

    def get(self, key, *args):
        default = next(iter(args), None)
        return self.current.get(key, default)

    def keys(self):
        return self.current.keys()

    def pop(self, key, *args):
        default = next(iter(args), None)
        return self.current.pop(key, default)

    def update(self, *args, **kwargs):
        return self(*args, **kwargs)

    def values(self):
        return self.current.values()




class Data(Base):
    """Dict wrapper with enhanced features, some inspired by JS Map and JS (plain) Object."""

    def __init__(self, *args, **current):
        Base.__init__(self)
        owner = self

        _current = next(iter(args), None)
        if _current is not None:
            # Create from pos arg
            if isinstance(_current, Data):
                _current = _current.copy()
            else:
                if not isinstance(_current, dict):
                    raise TypeError(f"Cannot create from: {str(_current)}.")
                _current = deepcopy(_current)
            current.update(_current)
        # Enforce "no None-value" convention
        current = {k: v for k, v in current.items() if v is not None}

        class match:
            def __init__(self):
                """XXX For future use."""

            def __call__(self, match: callable) -> callable:
                owner._.update(_match=match)

        
        self._.update(current=current, match=match)

    def __bool__(self):
        return bool(len(self.current))

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

        ##before = self._.get('_before')

        for key, value in updates.items():
            if value is None:
                # NOTE Convention: None removes
                self.current.pop(key, None)
            else:
                self.current[key] = value

        ##after = self._.get('_after')

        return self

    def __contains__(self, key):
        return key in self.current

    def __eq__(self, other) -> bool:
        if isinstance(other, Data):
            other = other.current
        elif not isinstance(other, dict):
            return False
        # Enforce "no None-value" convention
        other = {k: v for k, v in other.items() if v is not None}
        match = self._.get("_match")
        if match:
            if len(self) != len(other):
                return False
            for key, value in self:
                if key not in other:
                    return False
                if not match(value, other[key]):
                    return False
            return True
        return self.current == other

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self.current.get(key)

    def __iter__(self):
        return iter(self.current.items())

    def __len__(self) -> int:
        return len(self.current)

    def __rsub__(self, other):
        return self.difference(other)

    def __setattr__(self, key, value):
        self(**{key: value})

    def __setitem__(self, key, value):
        self(**{key: value})

    def __str__(self):
        return str(self.current)

    @property
    def current(self) -> dict:
        # NOTE Should only be accessed externally in special cases.
        return self._["current"]

    def __sub__(self, other):
        return self.difference(other, flip=True)

    @property
    def match(self) -> callable:
        """Returns decorator for value-level match function."""
        return self._["match"]

    @property
    def size(self) -> int:
        """Returns number of items."""
        return len(self)

    @property
    def writable(self) -> bool:
        return self._.get("writable", False)

    def clear(self) -> "Data":
        if not self.writable:
            raise AttributeError("Read-only.")
        updates = {k: None for k in self.keys()}
        # NOTE All changes channeled through __call__
        self(**updates)
        return self

    def clone(self) -> "Data":
        return Data(self)

    def config(self, writable=True) -> "Data":
        if writable:
            self._["writable"] = True
        else:
            self._.pop("writable", None)
        return self

    def copy(self, deep: bool = True) -> dict:
        if deep:
            return deepcopy(self.current)
        return self.current.copy()

    def difference(self, other: dict, flip=False):
        """Not flipped: Returns items that are in other, but not in data.
        Flipped: Returns items that are in data, but not in other."""
        if isinstance(other, Data):
            other = other.current
        if not isinstance(other, dict):
            raise TypeError(f"Cannot infer difference with respect to: {str(other)}.")
        match = self._.get("_match") or (lambda value, other: value == other)
        result = {}
        if flip:
            for key, value in self:
                if key in other:
                    if not match(value, other[key]):
                        result[key] = value
                else:
                    result[key] = value
            return result
        # NOTE Do not adapt to "no-None" value convention, since difference may be
        # used to trigger the "None removes" convention.
        for key, value in other.items():
            if key in self:
                if not match(value, self[key]):
                    result[key] = value
            else:
                result[key] = value
        return result

    def has(self, key) -> bool:
        return key in self

    def index(self, key) -> int:
        """Returns item index. Returns None if key does not exist."""
        if key in self.current:
            keys = list(self.current.keys())
            return keys.index(key)

    def items(self):
        return self.current.items()

    def get(self, key, *args):
        default = next(iter(args), None)
        return self.current.get(key, default)

    def keys(self):
        return self.current.keys()

    def pop(self, key, *args):
        default = next(iter(args), None)
        return self.current.pop(key, default)

    def update(self, *args, **kwargs):
        return self(*args, **kwargs)

    def values(self):
        return self.current.values()

