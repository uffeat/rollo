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

    log('Special:', tools.Special)

    class ref:
        """Python adaptation of Ref."""

        def __init__(self, *args):
            value = next(iter(args), None)
            state = Ref.create(value)

            class effect:
                def __init__(self, *args, once=False, run=False):
                    """."""
                    self.args = args
                    self.options = dict(once=once, run=run)

                def __call__(self, handler: callable) -> callable:

                    


                    
                    def wrapper(current, message, *args):
                        return handler(current)



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

            self._ = dict(effect=effect, match=None, state=state)

        def __call__(self, current, silent=False):
            self.state.update(current, dict(silent=silent))
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
