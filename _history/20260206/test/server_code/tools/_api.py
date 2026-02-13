class api:
    """Decorator for class-based api targets."""

    registry = {}

    def __init__(self, name: str = None, **options):
        self.name = name
        self.options = options

    def __call__(self, target: type) -> type:
        self.name = self.name if self.name else target.__name__.lower()
        self.registry[self.name] = dict(target=target, options=self.options)
        return target  # Enables stacking