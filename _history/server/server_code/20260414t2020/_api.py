from anvil.server import http_endpoint, route


class Api:
    """Base class for targets."""

    def __init__(self, *args, **public):
        self.__ = dict(
            private=dict(),
            public=public,
        )

    def __getitem__(self, key: str):
        return self._.get(key)

    def __getattr__(self, key: str):
        return self[key]

    @property
    def _(self) -> dict:
        return self.__["public"]


class api:
    """Decorates http or route endpoints with customizable path depth."""

    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def __call__(self, target, *args, **kwargs):
        name = next(iter(self.args), f"/{target.__name__}")

        if isinstance(target, type):
            instance = target(owner=self) if "__init__" in target.__dict__ else target()
        else:
            instance = target

        def wrapper(**kwargs):
            parts = [v for k, v in kwargs.items() if self.is_part(k)]
            path = f"/{'/'.join(parts)}"
            query = {k: v for k, v in kwargs.items() if not self.is_part(k)}
            return instance(path, parts=parts, **query)

        base = "" if name == "/" else name
        depth = self.kwargs.get("depth", 4)
        methods = self.kwargs.get("methods", ["GET"])

        if self.kwargs.get("type") == "api":
            http_endpoint(f"{name}", methods=methods)(wrapper)
            for i in range(depth + 1):
                signature = f"{base}" + "".join([f"/:_{j}" for j in range(i)])
                http_endpoint(signature)(wrapper)
        else:
            route(f"{name}", methods=methods)(wrapper)
            for i in range(depth + 1):
                signature = f"{base}" + "".join([f"/:_{j}" for j in range(i)])
                route(signature)(wrapper)

        return target

    @staticmethod
    def is_part(k: str) -> bool:
        """Tests if k is path part precursor."""
        return k.startswith("_") and k[1:].isdigit()
