class on:
    def __init__(self, target, *args, **options):
        self.target = target
        self.args = args
        self.options = options

    def __call__(self, handler: callable) -> callable:
        _handler = handler() if isinstance(handler, type) else handler
        type_ = self.args[0] if self.args else handler.__name__
        self.target.addEventListener(type_, _handler, self.options)
        return handler
