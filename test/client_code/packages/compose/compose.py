def main(use, *args, **kwargs):

    Object = use("@@/js").Object

    class compose:
        def __init__(self, target, *args):
            self._ = dict(target=target)
            name = next(iter(args), "")
            if name:
                self._.update(name=name)

        def __call__(self, source):
            if isinstance(source, type):
                instance = source()
                Object.defineProperty(
                    self._["target"],
                    self._.get("name") or source.__name__,
                    dict(
                        configurable=True,
                        enumerable=False,
                        get=lambda: instance,
                    ),
                )
            elif type(source).__name__ == "function":
                Object.defineProperty(
                    self._["target"],
                    self._.get("name") or source.__name__,
                    dict(
                        configurable=True,
                        enumerable=True,
                        writable=True,
                        value=source,
                    ),
                )
            elif isinstance(source, property):

                if isinstance(source, property):
                    target = self._["target"]

                    options = dict(
                        configurable=True,
                        enumerable=False,
                        get=lambda: source.fget(target),
                    )
                    if source.fset:
                        options.update(set=lambda v: source.fset(target, v))
                    Object.defineProperty(
                        target, self._.get("name") or source.fget.__name__, options
                    )

            else:
                # Not used as decorator
                if not self._.get("name"):
                    raise ValueError("No name.")
                Object.defineProperty(
                    self._["target"],
                    self._["name"],
                    dict(
                        configurable=False,
                        enumerable=True,
                        writable=False,
                        value=source,
                    ),
                )

            return source

    return dict(compose=compose)
