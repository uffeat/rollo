from .._assets import source
from . import _loaders

SAME = "/"


loaders = {
    k: v for k, v in _loaders.__dict__.items() if not k.startswith("_")
}
keys = tuple((k for k in loaders.keys()))


class packages:
    """Utility for dynamic package imports."""

    def __call__(self, specifier: str):
        """Returns package or package member."""
        
        
        key = specifier[len("@@/") :]
        if key.endswith(SAME):
            # Same-name member
            return self.get(key[: -len(SAME)], member=SAME)
        if ":" in key:
            # Other member
            key, _, member = key.partition(":")
            return self.get(key, member=member)
        # Package (no member)
        return self.get(key, member=None)

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

   
    def keys(self) -> tuple:
        """Returns package names."""
        return keys

    def get(self, key: str, member=None):
        """Returns package or package member."""
        package = self[key]
        if not member:
            return package
        if member == SAME:
            member = key
        if not hasattr(package, member):
            raise KeyError(
                f"Package '{key}' does not have a member called '{member}' (trace: {__file__})."
            )
        return getattr(package, member)


packages = packages()

@source("@@")
def handler(path=None, **kwargs):
    return packages(path.specifier)


