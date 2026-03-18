class Api:
    """Base class for targets."""

    def __init__(self, **_):
        self._ = _

    def __getitem__(self, key: str):
        if not hasattr(self, "_"):
            self._ = {}
        return self._.get(key)

    def __getattr__(self, key: str):
        return self._[key]



class api:
    """Decorator for class-based api targets."""

    registry = {}

    def __init__(self, name: str = None, **options):
        self.name = name
        self.options = options

    def __call__(self, target: type) -> type:
        if not self.name:
            self.name = target.__name__.lower()
        self.registry[self.name] = dict(target=target, options=self.options)
        return target  # Enables stacking
    



