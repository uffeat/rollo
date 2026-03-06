from .._assets import source
from . import _loaders

SAME = "/"


loaders = {
    name: load for name, load in _loaders.__dict__.items() if not name.startswith("_")
}
names = tuple((name for name in loaders.keys()))


class packages:
    """Utility for dynamic package imports."""

    def __call__(self, specifier: str):
        """Returns package or package member."""
        if not specifier:
            return self.names
        
        name = specifier[len("@@/") :]
        if name.endswith(SAME):
            # Same-name member
            return self.get(name[: -len(SAME)], member=SAME)
        if ":" in name:
            # Other member
            name, _, member = name.partition(":")
            return self.get(name, member=member)
        # Package (no member)
        return self.get(name, member=None)

    def __contains__(self, name: str) -> bool:
        """Checks, if package registered."""
        return name in loaders

    def __getitem__(self, name: str):
        """Returns package."""
        if name not in loaders:
            raise KeyError(f"Invalid package: {name} (trace: {__file__}).")
        return loaders[name]()

    def __getattr__(self, name: str):
        """Returns package."""
        return self[name]

    @property
    def names(self) -> tuple:
        """Returns package names."""
        return names

    def get(self, name: str, member=None):
        """Returns package or package member."""
        package = self[name]
        if not member:
            return package
        if member == SAME:
            member = name
        if not hasattr(package, member):
            raise KeyError(
                f"Package '{name}' does not have a member called '{member}' (trace: {__file__})."
            )
        return getattr(package, member)


packages = packages()

@source("@@")
def handler(path=None, **kwargs):
    return packages(path.specifier)


