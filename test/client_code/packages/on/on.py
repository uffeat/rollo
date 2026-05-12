def main(use, *args, **kwargs):

    class on:

        def __init__(self, target, *types, **options):
            self._ = dict(target=target, types=types, options=options)

        def __call__(self, handler: callable) -> callable:
            types = self._["types"] or [handler.__name__]
            # XXX class-based handlers are not suitable for decorator-stacking
            if isinstance(handler, type):
                handler = handler()
            for type_ in types:
                self._["target"].addEventListener(type_, handler, self._["options"])
            return handler

        @property
        def target(self):
            return self._["target"]

        def bind(self, target):
            self._["target"] = target

    return dict(on=on)
