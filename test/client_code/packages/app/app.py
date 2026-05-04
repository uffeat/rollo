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
    Reactive = use("@@/reactive", test=meta.test).Reactive

    class app:
        def __init__(self):
            """."""
            state = Reactive(use.app.state)

            class on:
                def __init__(self, *args, **options):
                    self.args = args
                    self.options = options

                def __call__(self, handler: callable) -> callable:
                    event_type = next(iter(self.args), handler.__name__)
                    # XXX class-based handlers are not suitable for decorator-stacking
                    if isinstance(handler, type):
                        handler = handler()
                    use.app.addEventListener(
                        event_type,
                        handler,
                        self.options,
                    )
                    return handler

            self._ = dict(on=on, state=state)

        def __call__(self, **updates):
            use.app.update(updates)

        @property
        def detail(self):
            return use.app.detail

        @property
        def effect(self) -> callable:
            """Decorates effect."""
            return self.state.effect

        @property
        def effects(self):
            """Returns effects controller."""
            return self.state.effects

        @property
        def node(self):
            return use.app

        @property
        def state(self):
            return self._["state"]


    app = app()

    return dict(app=app)
