def main(use, *args, **kwargs):

    console, document, log, meta, window = (
        use.console,
        use.document,
        use.log,
        use.meta,
        use.window,
    )

    class app:
        def __init__(self, *args, **kwargs):
            self._ = dict(app=document.getElementById("app"))
            owner = self

            class effect:
                def __init__(self, *keys, run=False, **options):
                    self.keys = keys or None
                    # Ensure that default 'run' option is False
                    options.update(run=run)
                    self.options = options

                def __call__(self, handler: callable) -> callable:
                    def wrapper(change, message):
                        handler(**change)

                    owner.app.effects.add(wrapper, self.options, self.keys)
                    return wrapper

            self._.update(effect=effect)

        def __call__(self, **updates):
            """Updates state."""
            return self.app.state.update(updates)

        def __getattr__(self, key: str):
            return self[key]

        def __getitem__(self, key: str):
            """Returns current value by key."""
            return self.app.state[key]

        @property
        def app(self):
            """Returns app component."""
            return self._["app"]

        @property
        def current(self) -> dict:
            """Returns current state."""
            return dict(self.app.state.current)

        @current.setter
        def current(self, current: dict):
            """Sets current state."""
            self.app.state.current = current

        @property
        def effect(self) -> callable:
            """Decorates effect."""
            return self._["effect"]

        @property
        def effects(self):
            """Returns effects conroller."""
            return self.app.effects

        @property
        def previous(self) -> dict:
            """Returns previous state."""
            return dict(self.app.state.previous)

    app = app()

    """Set up router.
    NOTE Using app state for routing enables:
    - Attribute-based page-specific styling; e.g., page="about" -> state-current-page="about" 
      attr on app.
    - Accessible from JS (without module import).
    XXX Use 'currentPage' key (rather than 'page') to avoid collision with CSS prop.
    """

    @window.on(run=True)
    def popstate(event):
        pathname = window.location.pathname
        currentPage = pathname[len("/test/") :]  ##
        app(currentPage=currentPage)

    return dict(app=app)
