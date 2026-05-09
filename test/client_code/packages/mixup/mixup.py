def main(use, *args, **kwargs):
    __file__ = "mixup"

    console, document, log, meta, window = (
        use.console,
        use.document,
        use.log,
        use.meta,
        use.window,
    )

    Object = use("@@/js").Object

    class mixup:

        def __init__(self, target):
            ##log("target:", target, trace=__file__, native=True)  ##
            self._ = dict(target=target)

        def __call__(self, source: type):
            ##log("source", source, trace=__file__)  ##
            for key, value in source.__dict__.items():
                if key == "__init__":
                    ##log("About to call __init__...", trace=__file__)  ##
                    ##log("__init__:", value, trace=__file__)  ##
                    value(self.target)
                    continue
                if key.startswith("__") and key.endswith("__"):
                    continue
                ##log("key:", key, trace=__file__)  ##
                if type(value).__name__ == "function":
                    self.add_method(key, value)
                    continue
                if isinstance(value, property):
                    self.add_property(key, value)
                    continue
            return source

        @property
        def target(self):
            return self._["target"]

        def add_method(self, key: str, value: callable):

            def wrapper(*args, **kwargs):
                return value(self.target, *args, **kwargs)

            ##setattr(wrapper, "__annotations__", getattr(value, "__annotations__", {}))
            ##setattr(wrapper, "__defaults__", getattr(value, "__defaults__", ""))
            ##setattr(wrapper, "__doc__", getattr(value, "__doc__", ""))
            ##setattr(wrapper, "__name__", getattr(value, "__name__", ""))
            Object.defineProperty(
                self.target,
                key,
                dict(
                    configurable=True,
                    enumerable=True,
                    writable=True,
                    value=wrapper,
                ),
            )

        def add_property(self, key: str, value: property):
            options = dict(
                configurable=True,
                enumerable=False,
                get=lambda: value.fget(self.target),
            )
            if value.fset:
                options.update(set=lambda v: value.fset(self.target, v))
            Object.defineProperty(self.target, key, options)

    return dict(mixup=mixup)
