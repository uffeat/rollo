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
    app = use("@@/app/", test=meta.test)
    component = use("@@/component/")

    _Ref = use("@/rollo/").Ref

    class Ref:
        """Python adaptation of Ref."""

        def __init__(self, *args, state=None):
            value = next(iter(args), None)
            if state is None:
                state = _Ref.create(value)
            else:
                state.update(value)
            

            class effect:
                def __init__(self, *args, once=False, run=False):
                    # BUG (in parcel) 'once' does not work for conditional effects.
                    self.args = args
                    self.options = dict(once=once, run=run)

                def __call__(self, handler: callable) -> callable:

                    if isinstance(handler, type):
                        handler = handler()

                    def wrapper(current, message, *args):
                        return handler(current)

                    values = [a for a in self.args if not callable(a)]
                    if values:
                        state.effects.add(wrapper, values, self.options)
                    else:
                        first = next(iter(self.args), None)
                        if callable(first):

                            def condition(current, message, *args):
                                return first(current)

                            state.effects.add(wrapper, condition, self.options)
                        else:
                            state.effects.add(wrapper, self.options)

                    return wrapper

            self._ = dict(effect=effect, state=state)

        def __call__(self, value, silent=False):
            self.state.update(value, dict(silent=silent))
            return self

        @property
        def current(self):
            return self.state.current

        @property
        def effect(self):
            """Decorates effect."""
            return self._["effect"]

        @property
        def previous(self):
            return self.state.previous

        @property
        def size(self):
            return self.state.effects.size

        @property
        def state(self):
            return self._["state"]

        def clear(self):
            """."""
            self.state.effects.clear()
            return self

    class effect:
        """Decorates unbound JS Ref effect."""

        def __init__(self, state, *args):
            self.state = state
            self.args = args

        def __call__(self, handler: callable) -> callable:
            def wrapper(change, message, *args):
                handler(**change)

            self.state.effects.add(wrapper, *self.args)
            return wrapper

    return dict(Ref=Ref, effect=effect)
