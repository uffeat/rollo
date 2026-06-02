from pathlib import Path

SOURCE = "test/client_code/packages/state/dev"
UTF_8 = "utf-8"


class View:
    """Minimal read-only dict wrapper with support for dot notation.
    Use for constructed modules."""

    def __init__(self, _: dict):
        self.__dict__.update(_=_)

    def __contains__(self, key) -> bool:
        return key in self._

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self._.get(key)

    def __iter__(self):
        return iter(self._)

    def __len__(self) -> int:
        return len(self._)

    def __str__(self) -> str:
        return str(self._)

    def items(self):
        return self._.items()

    def keys(self):
        return self._.keys()

    def values(self):
        return self._.values()


class use:
    def __init__(self):
        _ = dict(cache={})
        self.__dict__.update(_=_)

    def __call__(self, path: str, *args, **kwargs) -> View:
        path = path[2:]
        if path.endswith("/"):
            parts = path.split("/")[:-1]
            path = f'{"/".join(parts)}/{parts[-1]}.py'
        elif not path.endswith(".py"):
            path = f"{path}.py"

        cache = self._["cache"]
        if path in cache:
            return cache[path]
        text = (Path.cwd() / f"{SOURCE}{path}").read_text(encoding=UTF_8)
        locals = {}
        exec(text, {}, locals)
        exports: dict = locals["main"](self)
        exports = View(exports)
        cache[path] = exports
        return exports


use = use()
