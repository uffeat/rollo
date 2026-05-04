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
 
    component = use("@@/component/")

    __file__ = "reactive"

    # XXX Cannot make test version of 'effect' work!!?
    Effect = use("@@/reactive").effect

    class Reactive:
        def __init__(self, state):
            owner = self

            class effect(Effect):
                def __init__(self, *args, **kwargs):
                    Effect.__init__(self, owner, *args, **kwargs)

            class filter:
                def __init__(self, silent=False):
                    self.silent = silent

                def __call__(self, predicate: callable):
                    return state.filter(predicate, self.silent)

            class transform:
                def __init__(self, silent=False):
                    self.silent = silent

                def __call__(self, transformer: callable):
                    return state.map(transformer, self.silent)

            self._ = dict(
                effect=effect, filter=filter, state=state, transform=transform
            )

        def __call__(self, silent: bool = False, **updates):
            """Updates state."""
            return self.state.update(updates, dict(silent=silent))

        def __getattr__(self, key: str):
            return self[key]

        def __getitem__(self, key: str):
            return getattr(self.state, key, None)

        def __contains__(self, key: str) -> bool:
            return self.has(key)

        def __eq__(self, other) -> bool:
            return self.match(other)

        def __iter__(self):
            return iter(self.items())

        def __len__(self) -> int:
            return len(self.size)

        @property
        def change(self):
            """Returns changes from most recent update."""
            return self.state.change

        @property
        def config(self):
            return self.state.config

        @property
        def current(self):
            return self.state.current

        @current.setter
        def current(self, current: dict):
            self.state.current = current

        @property
        def detail(self):
            return self.state.detail

        @property
        def effect(self) -> callable:
            """Decorates effect."""
            return self._["effect"]

        @property
        def effects(self):
            """Returns effects controller."""
            return self.state.effects

        @property
        def filter(self) -> callable:
            """Decorates filter."""
            return self._["filter"]

        @property
        def previous(self):
            return self.state.previous

        @property
        def size(self) -> int:
            """Returns number of state items."""
            return self.state.size

        @property
        def state(self):
            """Returns wrapped state controller."""
            return self._["state"]

        @property
        def transform(self) -> callable:
            """Decorates transformer."""
            return self._["transform"]

        def clear(self, silent=False):
            """Clears state items reactively (subject to 'silent' flag)."""
            return self.state.clear(silent)

        def copy(self):
            """."""
            state = self.state.copy()
            return Reactive(state)

        def has(self, key: str) -> bool:
            """."""
            return self.state.has(key)

        def items(self) -> list:
            """."""
            return list(self.state.entries())

        def keys(self) -> list:
            return list(self.state.keys())

        def match(self, other):
            """."""
            if isinstance(other, dict):
                other = js.object(**other)
            return self.state.match(other)

        def values(self) -> list:
            return list(self.state.values())

    return dict(Reactive=Reactive, effect=Effect)
