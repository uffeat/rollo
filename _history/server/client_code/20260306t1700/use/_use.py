from ..console import console, log
from ..document import clean, document
from ..native import native
from .. import tools
from ..window import window
from ..works import works
from ._assets import assets, compose, processor, source, transformer
from ._main import main
from ._packages import packages
from ._server import rpc
from . import _own as _

document.documentElement.dataset.bsTheme = "dark"

added = {}
assets.anvil = works
assets.compose("packages", packages)
root = assets.get("@/rollo/").app


class effect:
    """Decorates effect on root element"""
    def __init__(self, *conditions, **options):
        self.conditions = conditions
        self.options = options

    def __call__(self, handler):
        root.effects.add(handler, self.conditions, self.options)
        return handler


_ = dict(
    anvil=works,
    api=NotImplementedError,
    assets=assets,
    compose=compose,
    console=console,
    document=document,
    effect=effect,
    main=main,
    native=native,
    packages=packages,
    processor=processor,
    root=root,
    rpc=rpc,
    source=source,
    tools=tools,
    transformer=transformer,
    window=window,
)


class use:
    def __call__(self, specifier, *args, **kwargs):
        if specifier in added:
            return added["specifier"]
        result = assets.get(specifier, kwargs, *args)
        return result
    
    def __getattr__(self, key: str):
        return self[key]

    def __getitem__(self, key: str):
        return _.get(key, KeyError)

    
    def add(self, key, value):
        """Injects useable."""
        added[key] = value
        return self


use = use()

# Clean up document
clean()
