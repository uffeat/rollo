from anvil.server import call, callable as callable_

class Api:
    """Base class for api targets."""

    def __init__(self, **_):
        self._ = _

    @property
    def meta(self):
        return self._.get('meta')
    
    @property
    def owner(self):
        return self._.get('owner')
    
    @property
    def state(self):
        return self._.get('state')


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
    



