def main(use, *args, **kwargs):

    use("@@/assets/")
    anvil, app, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.app,
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
    

    Special = tools.Special
    Ref = use("@/rollo/").Ref

    class ref:
        """Python adaptation of Ref."""

        def __init__(self, *args):
            value = next(iter(args), None)
            state = Ref.create(value)

            class effect:
                def __init__(self, *args, once=False, run=False):
                    self.args = args
                    self.options = dict(once=once, run=run)

                def __call__(self, handler: callable) -> callable:
                    special = Special(handler)
                    if isinstance(handler, type):
                        handler = handler()

                    @special.target()
                    def wrapper(current, message):
                        return handler(current)
                    
                    log('HERE', trace='effect')

                    values = [a for a in self.args if not callable(a)]
                    if values:
                        state.effects.add(wrapper, values, self.options)
                    else:
                        first = next(iter(self.args), None)
                        if callable(first):

                            def condition(current, message):
                                return first(current)

                            state.effects.add(wrapper, condition, self.options)
                        else:
                            state.effects.add(wrapper, self.options)
                    return wrapper

            class match:
                def __init__(self):
                    """."""

                def __call__(self, handler: callable) -> callable:
                    """."""
                    if not hasattr(handler, "bind"):
                        setattr(
                            handler,
                            "bind",
                            lambda *args: setattr(handler, "context", state),
                        )
                    state.match = handler
                    return handler

            self._ = dict(effect=effect, match=match, state=state)

            @self.match()
            def match(value, other):
                return value == other

        def __call__(self, current, silent=False):
            self.state.update(current)
            return self

        @property
        def current(self):
            return self.state.current

        @property
        def effect(self):
            """Decorates effect."""
            return self._["effect"]

        @property
        def effects(self):
            return self.state.effects

        @property
        def match(self):
            """Decorates match function."""
            return self._["match"]

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


    return dict(ref=ref)
