from anvil.js import import_from


assets = import_from("https://rolloh.vercel.app/anvil/use.js").assets


class compose:
    def __init__(self, name=None):
        self.name = name

    def __call__(self, source):
        if not self.name:
            self.name = source.__name__
        _source = source() if isinstance(source, type) else source
        assets.compose(self.name, _source)
        return source


class source:
    def __init__(self, key):
        self.key = key

    def __call__(self, handler):
        _handler = handler() if isinstance(handler, type) else handler

        def wrapper(kwargs, *args):
            return _handler(*args, **kwargs)

        assets.sources.add(self.key, wrapper)
        return handler


class transformer:
    def __init__(self, key):
        self.key = key

    def __call__(self, handler):
        _handler = handler() if isinstance(handler, type) else handler

        def wrapper(result, kwargs, *args):
            return _handler(result, *args, **kwargs)

        assets.types.add(self.key, wrapper)
        return handler


class processor:
    def __init__(self, key):
        self.key = key

    def __call__(self, handler):
        _handler = handler() if isinstance(handler, type) else handler

        def wrapper(result, kwargs, *args):
            return _handler(result, *args, **kwargs)

        assets.processors.add(self.key, wrapper)
        return handler
