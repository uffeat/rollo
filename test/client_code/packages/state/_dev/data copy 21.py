from copy import deepcopy
import json
from types import MappingProxyType


class Base:

    @classmethod
    def Keys(cls) -> tuple:
        """Returns unique member names."""
        result = []
        for c in cls.mro():
            _result = [
                k
                for k, v in c.__dict__.items()
                if not k.startswith("__") and not k.endswith("__") and len(k) > 2
            ]
            result.extend(_result)
        return tuple(set(result))

    def __init__(self):
        # NOTE Add to '__dict__' to enable '__setattr__'
        self.__dict__.update(__={})

    @property
    def _(self) -> dict:
        return self.__


class Data(Base):
    """Superset of dict with special update features."""

    def __init__(self, *args, **updates):
        Base.__init__(self)
        self._.update(data={}, reserved=Data.Keys())
        self(*args, **updates)

    def __bool__(self):
        data: dict = self._["data"]
        return bool(len(data))

    def __call__(self, *args, **updates) -> "Data":
        """Updates data."""
        # Check frozen state
        if self._.get("frozen", False):
            raise AttributeError(f"Cannot change frozen instance: {self}.")
        # Get data
        data: dict = self._["data"]
        # Update from first pos arg
        first = next(iter(args), ...)
        if first is None and data:
            # NOTE Convention: None first pos arg clears
            return self.clear()
        if first is not ...:
            if isinstance(first, Data):
                # Update from Data instance
                first: dict = first._["data"]
                updates.update(first)
            elif isinstance(first, dict):
                # Update from dict
                updates.update(first)
            else:
                raise TypeError(f"Cannot update from: {str(first)}.")
        # Check keys
        reserved = self._["reserved"]
        for key in updates.keys():
            if key in reserved:
                raise KeyError(f"Reserved key: {key}")
        # Update data
        for key, value in updates.items():
            if value is None and data:
                # NOTE Convention: None-value removes when updating, but not at creation
                data.pop(key, None)
            else:
                data[key] = value
        return self

    def __contains__(self, key) -> bool:
        data: dict = self._["data"]
        return key in data

    def __delattr__(self, key) -> None:
        # Channel changes through __call__
        self({key: None})

    def __eq__(self, other) -> bool:
        data: dict = self._["data"]
        if isinstance(other, Data):
            other: dict = other._["data"]
        return other == data

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        data: dict = self._["data"]
        return data.get(key)

    def __iter__(self):
        data: dict = self._["data"]
        return iter(data)

    def __len__(self) -> int:
        data: dict = self._["data"]
        return len(data)

    def __ne__(self, other) -> bool:
        data: dict = self._["data"]
        if isinstance(other, Data):
            other: dict = other._["data"]
        return other != data

    def __setattr__(self, key, value) -> None:
        self(**{key: value})

    def __setitem__(self, key, value) -> None:
        self(**{key: value})

    def __str__(self) -> str:
        data: dict = self._["data"]
        return str(data)

    def clear(self, *keys) -> "Data":
        # Channel changes through __call__
        if not keys:
            keys = self.keys()
        return self({k: None for k in keys})

    def copy(self, deep: bool = True) -> dict:
        # NOTE Deep copy by default
        data: dict = self._["data"]
        if deep:
            return deepcopy(data)
        return data.copy()

    def freeze(self) -> "Data":
        """Prevents subsequent changes."""
        self._.update(frozen=True)
        return self

    def get(self, key, *args):
        data: dict = self._["data"]
        default = next(iter(args), None)
        return data.get(key, default)

    def index(self, key) -> int:
        """Returns item index. Returns None if key does not exist."""
        data: dict = self._["data"]
        if key in data:
            keys = list(data.keys())
            return keys.index(key)

    def items(self):
        data: dict = self._["data"]
        return data.items()

    def json(self) -> str:
        # NOTE Intentionally fails if data is not jsonable.
        data: dict = self._["data"]
        return json.dumps(data)

    def keys(self):
        data: dict = self._["data"]
        return data.keys()

    def pop(self, key, *args):
        # NOTE No need to provide default value
        if key in self:
            value = self[key]
            # Channel changes through __call__
            self({key: None})
            return value
        return next(iter(args), None)

    def update(self, *args, **kwargs) -> "Data":
        return self(*args, **kwargs)

    def values(self):
        data: dict = self._["data"]
        return data.values()


class Message(Base):
    """Argument for effects."""

    def __init__(self, change: Data = None, state: int = None):
        Base.__init__(self)
        self._.update(change=change, detail=Data(), state=state, transient={})

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self.change.get(key, ...)

    def __iter__(self):
        return iter(self.change)

    def __str__(self) -> str:
        return str(self.change)

    def keys(self):
        return self.change.keys()

    @property
    def change(self) -> Data:
        return self._["change"]

    @property
    def data(self) -> Data:
        transient: dict = self._["transient"]
        spec: dict = transient.get("spec", {})
        data = spec.get("data")
        if data is None:
            # Create data on-demand
            data = Data()
            spec.update(data=data)
        return data

    @property
    def detail(self) -> Data:
        # NOTE Belongs to message. Useful for inter-effects coms.
        return self._["detail"]

    @property
    def effect(self) -> callable:
        transient: dict = self._["transient"]
        return transient.get("effect")

    @property
    def index(self) -> int:
        transient: dict = self._["transient"]
        return transient.get("index")

    @property
    def state(self) -> "State":
        return self._["state"]


class Condition(Base):
    """Creates condition function from keys"""

    def __init__(self, *keys):
        Base.__init__(self)

        def condition(message: Message):
            for key in message.keys():
                if key in keys:
                    return True
            return False

        self._.update(condition=condition)

    def __call__(self, message: Message) -> bool:
        return self._["condition"](message)


class Effects(Base):
    """Effects controller."""

    def __init__(self, owner: "State"):
        Base.__init__(self)
        self._.update(owner=owner, registry=dict())

    def __bool__(self):
        registry: dict = self._["registry"]
        return bool(registry)

    def __call__(self, change: Data) -> "Effects":
        """Runs effects."""
        ##print("Number of effects:", len(self)")  ##
        # Check if effects registered
        if self:
            # Create container to capture 'once' effects
            remove = []
            # Create message
            message = Message(change, self.owner)
            transient: dict = message._["transient"]
            # Run effects
            for index, (effect, spec) in enumerate(self.items()):
                spec: dict = spec
                # Extract once flag
                once: bool = spec.pop("once", False)
                condition = spec.get("condition")
                # Update transient
                transient.update(effect=effect, index=index, spec=spec)
                if not condition or condition(message):
                    effect(message)
                    if once:
                        remove.append(effect)
                # Reset transient
                transient.clear()
            # Remove 'once' effects
            for effect in remove:
                self.remove(effect)
        return self

    def __contains__(self, effect: callable) -> bool:
        """Checks if effect registered."""
        registry: dict = self._["registry"]
        return effect in registry

    def __iter__(self):
        """Returns iterator for registry."""
        registry: dict = self._["registry"]
        return iter(registry)

    def __len__(self) -> int:
        """Returns number of registered effects."""
        registry: dict = self._["registry"]
        return len(registry)

    @property
    def max(self) -> int:
        # NOTE Returns None if no max
        return self._.get("max")

    @max.setter
    def max(self, max: int):
        if max is None:
            self._.pop("max", None)
        else:
            self._["max"] = max

    @property
    def owner(self) -> "State":
        return self._["owner"]

    def add(
        self,
        effect: callable,
        condition: callable = None,
        once: bool = None,
        protected: bool = None,
        run: bool = None,
        **data,
    ) -> callable:
        if effect in self:
            # Effect already registered -> update spec
            spec = self.update(
                effect, condition=condition, once=once, protected=protected, **data
            )
        else:
            if self.max and len(self) >= self.max:
                raise ValueError(f"Cannot register more than {self.max} effects.")
            registry: dict = self._["registry"]
            # Register
            registry[effect] = {}
            spec = self.update(
                effect, condition=condition, once=once, protected=protected, **data
            )
            if isinstance(effect, Effect):
                _registry: dict = effect.subscriptions._["registry"]
                if self.owner not in _registry:
                    _registry[self.owner] = spec
        if run:
            change = self.owner.current
            condition = spec.get("condition")
            # Create message
            message = Message(change=change, state=self.owner)
            # Update transient
            transient: dict = message._["transient"]
            transient.update(effect=effect, spec=spec)
            if not condition or condition(message):
                effect(message)
            # Handle the unlikely case: run + once
            if once:
                self.remove(effect)
        return effect

    def clear(self, force=False) -> None:
        remove = []
        for effect, spec in self:
            spec: dict = spec
            protected = spec.get("protected")
            if protected and not force:
                continue
            remove.append(effect)
        for effect in remove:
            self.remove(effect)

    def get(self, effect: callable) -> dict:
        """Returns spec associated with registered effect."""
        registry: dict = self._["registry"]
        return registry.get(effect)

    def index(self, effect: callable) -> int:
        """Returns effect index. Returns None if effect not registered."""
        if effect in self:
            keys = list(self.keys())
            return keys.index(effect)

    def items(self):
        registry: dict = self._["registry"]
        return registry.items()

    def keys(self):
        registry: dict = self._["registry"]
        return registry.keys()

    def remove(self, effect: callable) -> None:
        registry: dict = self._["registry"]
        registry.pop(effect, None)
        if isinstance(effect, Effect):
            _registry: dict = effect.subscriptions._["registry"]
            if self.owner in _registry:
                _registry.pop(self.owner, None)

    def update(
        self,
        effect: callable,
        condition: callable = None,
        once: bool = None,
        protected: bool = None,
        **data,
    ) -> dict:
        """Updates spec associated with effect."""
        spec: dict = self.get(effect)
        if not isinstance(spec, dict):
            raise KeyError("Cannot update spec.")
        # Update data associated with effect
        if data:
            _data = spec.get("data")
            if _data is None:
                _data = Data()
                spec["data"] = _data
            _data(data)
        if condition is not None:
            spec.update(condition=condition)
        if once is not None:
            spec.update(once=once)
        if protected is not None:
            spec.update(protected=protected)
        return spec

    def values(self):
        registry: dict = self._["registry"]
        return registry.values()


class State(Base):
    """."""

    def __init__(self, *args, **updates):
        Base.__init__(self)
        _current = Data(*args, **updates)
        effects = Effects(self)
        hooks = {}

        class hook:
            def __init__(self, *args):
                self.args = args

            def __call__(self, handler: callable) -> callable:
                name = next(iter(self.args), handler.__name__)
                hooks[name] = handler
                ##print("Registered capability:", name)  ##
                return handler

        # Set default 'matches' capability
        @hook()
        def matches(value, other):
            return value == other

        class effect:
            def __init__(self, *args, **kwargs):
                self.args = args
                self.kwargs = kwargs

            def __call__(self, effect: callable) -> callable:
                effects.add(effect, *self.args, **self.kwargs)
                return effect

        self._.update(
            _current=_current,
            change=Data().freeze(),
            config={},
            current=Data(_current).freeze(),
            detail=Data(),
            effects=effects,
            effect=effect,
            hook=hook,
            hooks=hooks,
            previous=Data().freeze(),
        )

    def __bool__(self):
        current: Data = self._["_current"]
        return bool(current)

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
        change: dict = self.difference(updates)
        ##print("change:", change)  ##
        if change:
            # Handle session
            if self.session is None:
                # Init session
                self._["session"] = 0
            else:
                # Update session
                self._["session"] += 1

            hooks: dict = self._["hooks"]

            # Get private current
            _current: Data = self._["_current"]
            # Update previous
            self._.update(
                previous=Data(_current).freeze(),
            )
            # Update private current
            _current(change)

            # Update change and public current
            change = Data(change).freeze()
            self._.update(
                change=change,
                current=Data(_current).freeze(),
            )
            on_change = hooks.get("on_change")
            if on_change:
                on_change(self, **change)
            # Run effects
            self.effects(change)
        return self

    def __contains__(self, key):
        current: Data = self._["_current"]
        return key in current

    def __getitem__(self, key):
        current: Data = self._["_current"]
        return current[key]

    def __iter__(self):
        current: Data = self._["_current"]
        return iter(current)

    def __len__(self) -> int:
        current: Data = self._["_current"]
        return len(current)

    def __setitem__(self, key, value):
        self(**{key: value})

    def __str__(self) -> str:
        current: Data = self._["_current"]
        return str(current)

    @property
    def hook(self) -> callable:
        """Decorates hook."""
        return self._["hook"]

    @property
    def change(self) -> Data:
        """Returns changes from most recent update."""
        return self._["change"]

    @property
    def context(self):
        config: dict = self._["config"]
        return config.get("context")

    @property
    def current(self) -> Data:
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
        return self._["effects"]

    @property
    def name(self) -> str:
        config: dict = self._["config"]
        return config.get("name", "")

    @property
    def previous(self) -> Data:
        """Returns current as-was before most recent update."""
        return self._["previous"]

    @property
    def session(self) -> int:
        return self._.get("session")

    def clear(self, *keys) -> "State":
        """Clears current reactively."""
        if not keys:
            keys = self.keys()
        return self({k: None for k in keys})

    def configure(self, **updates) -> "State":
        """Updates config."""
        if updates:
            config: dict = self._["config"]
            config.update(updates)
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
        hooks: dict = self._["hooks"]
        matches = hooks.get("matches")
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

    def json(self) -> str:
        # NOTE Intentionally fails if data is not jsonable.
        _current: Data = self._["_current"]
        return _current.json()

    def keys(self):
        _current: Data = self._["_current"]
        return _current.keys()

    def pop(self, key, *args):
        if key in self:
            value = self[key]
            self({key: None})
            return value
        return next(iter(args), None)

    def update(self, *args, **kwargs) -> "Data":
        return self(*args, **kwargs)

    def values(self):
        _current: Data = self._["_current"]
        return _current.values()


class state(Base):
    """Creates State instance with protected effect."""

    def __init__(
        self,
        *args,
        context=None,
        run: bool = False,
        state: State = None,
        **updates,
    ):
        Base.__init__(self)
        if not state:
            state = State(*args, **updates)
        state(*args)

        self._.update(run=run, state=state)
        state.configure(context=context)

    def __call__(self, handler: callable) -> State:
        """."""
        run: dict = self._.pop("run")
        state: State = self._.pop("state")
        hooks: dict = state._["hooks"]
        hooks.update(on_change=handler)
        state.configure(name=handler.__name__)
        if run:
            handler(state, **state.copy())
        return state


class Subscriptions(Base):
    def __init__(self, owner: "Effect"):
        Base.__init__(self)
        registry = {}
        self._.update(owner=owner, registry=registry)

    def __bool__(self):
        registry: dict = self._["registry"]
        return bool(registry)

    def __contains__(self, state):
        registry: dict = self._["registry"]
        return state in registry

    def __iter__(self):
        registry: dict = self._["registry"]
        return iter(registry)

    def __len__(self) -> int:
        registry: dict = self._["registry"]
        return len(registry)

    def __str__(self) -> str:
        registry: dict = self._["registry"]
        return str(registry)

    @property
    def owner(self) -> "Effect":
        return self._["owner"]

    def add(
        self,
        state: State,
        condition: callable = None,
        once: bool = None,
        protected: bool = None,
        run: bool = None,
    ):
        """Adds owner effect to state."""
        registry: dict = self._["registry"]
        if state in self:
            state.effects.update(
                self.owner, condition=condition, once=once, protected=protected
            )
        else:
            registry[state] = {}
            state.effects.add(
                self.owner, condition=condition, once=once, protected=protected, run=run
            )

    def clear(self, *states, force=False):
        """."""
        if not states:
            states = self.keys()
        remove = []
        for state in states:
            if force:
                remove.append(state)
            else:
                spec: dict = self.get(state)
                protected = spec.get("protected")
                if not protected:
                    remove.append(state)

        for state in remove:
            self.remove(state)

    def get(self, state: State) -> dict:
        """Returns spec associated with effect."""
        return state.effects.get(self.owner)

    def items(self):
        registry: dict = self._["registry"]
        return registry.items()

    def keys(self):
        registry: dict = self._["registry"]
        return registry.keys()

    def remove(self, state: State):
        """."""
        registry: dict = self._["registry"]
        registry.pop(state, None)
        state.effects.remove(self.owner)

    def values(self):
        registry: dict = self._["registry"]
        return registry.values()

    def update(self, state: State, **updates):
        """."""
        if state not in self:
            raise KeyError(f"Does not subscribe to state: {state}")
        state.effects.update(self.owner, **updates)


class Effect(Base):
    """State effect."""

    def __init__(self, context=None, source: callable = None, **detail):
        """NOTE
        - 'context' can be a State instance to also make the effect reactive.
        - Use 'detail' to make the effect stateful.
        """
        Base.__init__(self)
        owner = self

        class _source:
            def __init__(self, name: str = None):
                self.name = name

            def __call__(self, source: callable) -> callable:
                if not self.name:
                    self.name = source.__name__
                owner._.update(name=self.name, source=source)
                return source

        self._.update(
            detail=Data(),
            _source=_source,
            subscriptions=Subscriptions(self),
        )
        if context:
            self._.update(context=context)
        if detail:
            self.detail(detail)
        if source:
            self._.update(source=source)

    def __call__(self, message: Message):
        source = self._.get("source")
        if source:
            return source(self, message)

    @property
    def context(self):
        return self._.get("context")

    @property
    def detail(self) -> Data:
        return self._["detail"]

    @property
    def name(self) -> str:
        return self._.get("name", "")

    @property
    def source(self) -> type:
        """Decorates source function."""
        return self._["_source"]

    @source.setter
    def source(self, source: callable):
        """Sets source function."""
        self._["source"] = source

    @property
    def subscriptions(self) -> Subscriptions:
        """."""
        return self._["subscriptions"]


class effect(Base):
    """."""

    def __init__(self, context=None, **detail):
        Base.__init__(self)
        effect = Effect(context=context, **detail)
        self._.update(effect=effect)

    def __call__(self, source: callable, name: str = None) -> Effect:
        effect: Effect = self._["effect"]
        effect.source(name=name)(source)
        return effect
