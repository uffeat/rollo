def main(use, *args, **kwargs):

    Object = use("@@/js").Object

    class patch:
        """Patches members onto target."""

        def __init__(
            self,
            target,
            *args,
            configurable: bool = False,
            enumerable: bool = True,
            writable: bool = False,
        ):
            self._ = dict(
                options=dict(
                    configurable=configurable, enumerable=enumerable, writable=writable
                ),
                target=target,
            )
            name = next(iter(args), '')
            if name:
                self._.update(name=name)

        def __call__(self, source):
            self._["options"].update(value=source)
            Object.defineProperty(
                self._["target"],
                self._.get("name") or source.__name__,
                self._["options"],
            )
            return source

    return dict(patch=patch)
