class Api:
    """Base class for targets."""

    def __init__(self, **public):
        self.__ = dict(
            private=dict(),
            public=public,
        )

    def __getitem__(self, key: str):
        return self._.get(key)
    
    def __getattr__(self, key: str):
        return self[key]

    @property
    def _(self) -> dict:
        return self.__["public"]


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
