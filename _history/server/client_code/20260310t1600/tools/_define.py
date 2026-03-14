from anvil.js.window import Object


class define:
    def __init__(self, target):

        self._target = target

    def method(self, method, name: str = None) -> "define":
        """Defines method on target."""
        if not name:
            name = method.__name__
        Object.defineProperty(
            self._target,
            name,
            dict(
                configurable=True,
                enumerable=True,
                writable=True,
                value=method,
            ),
        )
        return self

    def property(self, *args, name: str = None) -> "define":
        """Defines accessor property on target."""

        if len(args) == 1:
            if isinstance(args[0], property):
                fget, fset = args[0].fget, args[0].fset
            else:
                fget, fset = args[0], None
        else:
            fget, fset = args

        options = dict(
            configurable=True,
            enumerable=False,
            get=fget,
        )
        if fset:
            options["set"] = fset

        if not name:
            name = fget.__name__

        Object.defineProperty(self._target, name, options)
        return self

    def value(
        self,
        value,
        configurable: bool = False,
        enumerable: bool = True,
        name: str = None,
        writable: bool = False,
    ) -> "define":
        """Defines value on target."""
        if not name:
            name = value.__name__
        Object.defineProperty(
            self._target,
            name,
            dict(
                configurable=configurable,
                enumerable=enumerable,
                writable=writable,
                value=value,
            ),
        )
        return self
    
