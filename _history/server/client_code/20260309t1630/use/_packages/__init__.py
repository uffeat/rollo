from .._assets import source
from . import _loaders

MEMBER, SAME, SOURCE = ":", "/", "@@"

loaders = {k: v for k, v in _loaders.__dict__.items() if not k.startswith("_")}
keys = tuple((k for k in loaders.keys()))


class packages:
    """Imports packages dynamically."""

    def __call__(self, specifier: str, test=False):
        """Returns package or package member."""

        key, member = self.parse(specifier)
        package = self[key]
        if member:
            if not hasattr(package, member):
                raise KeyError(
                    f"Package '{key}' does not contain '{member}' (trace: {__file__})."
                )
            return getattr(package, member)
        return package

    def __contains__(self, key: str) -> bool:
        """Checks, if package registered."""
        return key in loaders

    def __getitem__(self, key: str):
        """Returns package."""
        if key not in loaders:
            raise KeyError(f"Invalid package: {key} (trace: {__file__}).")
        return loaders[key]()

    def __getattr__(self, key: str):
        """Returns package."""
        return self[key]
    
    @property
    def key(self) -> str:
        return SOURCE

    @staticmethod
    def keys() -> tuple:
        """Returns package names."""
        return keys

    @staticmethod
    def parse(specifier: str) -> tuple:
        key = specifier[len(f"{SOURCE}/") :]
        if key.endswith(SAME):
            # Same-name member
            key = key[: -len(SAME)]
            return key, key
        if MEMBER in key:
            # Other member
            key, _, member = key.partition(MEMBER)
            return key, member
        # No member
        return key, None


packages = packages()


@source(SOURCE)
def handler(path=None, **kwargs):
    return packages(path.specifier)
