"""
reactive/effect.py
"""


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

    _Reactive = use("@/rollo/").Reactive


    class effect:
        """Decorates unbound JS Reactive effect."""

        def __init__(self, state, *keys, once=False, run=False, **items):
            # XXX 'items' should not contain the keys: "once", "run"
            self.state = state
            self.keys = keys
            self.options = dict(once=once, run=run)
            self.items = items

        def __call__(self, handler: callable) -> callable:
            special = tools.Special(handler)
            if isinstance(handler, type):
                handler = handler()

            @special.target()
            def wrapper(change, message, *args):
                handler(**change)

            keys = [a for a in self.keys if isinstance(a, str)]
            if keys:
                self.state.effects.add(wrapper, self.options, keys)
            elif self.items:
                # XXX Reference to 'self' inside condition causes crash!!!
                # Probably an Anvil quirk...
                required = self.items

                def condition(change, message, *args):
                    change = dict(change)
                    for key, value in change.items():
                        if key not in required:
                            return False
                        if value != required[key]:
                            return False
                    return True

                self.state.effects.add(wrapper, self.options, condition)
            else:
                first = next(iter(self.keys), None)
                if callable(first):

                    def condition(change, message, *args):
                        return first(**change)

                    self.state.effects.add(wrapper, self.options, condition)
                else:
                    self.state.effects.add(wrapper, self.options)
            return wrapper
        

    state = _Reactive.create()


    @effect(state)
    def _effect(**change):
        """Catch-all."""
        log("change", change, trace=_effect.__doc__)


    state.update(dict(foo=42))



    