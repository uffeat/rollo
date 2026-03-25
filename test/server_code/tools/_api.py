class Api:
    """Base class for targets."""

    def __init__(self, **public):
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

