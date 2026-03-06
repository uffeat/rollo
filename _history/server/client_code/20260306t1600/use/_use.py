from ..console import console
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


assets.anvil = works
assets.compose('packages', packages)

added = {}

class use:
    def __call__(self, specifier, *args, **kwargs):
        if specifier in added:
            return added['specifier']
        result = assets.get(specifier, kwargs, *args)
        return result

    @property
    def anvil(self):
        return works
    
    @property
    def api(self):
        """TODO"""

    @property
    def assets(self):
        return assets
    
    @property
    def compose(self):
        return compose

    @property
    def console(self):
        return console

    @property
    def document(self):
        return document
    
    @property
    def main(self):
        return main

    @property
    def native(self):
        return native

    @property
    def packages(self):
        return packages
    
    @property
    def processor(self):
        return processor
    
    @property
    def rpc(self):
        return rpc
    
    @property
    def source(self):
        return source

    @property
    def tools(self):
        return tools
    
    @property
    def transformer(self):
        return transformer

    @property
    def window(self):
        return window
    
    def add(self, key, value):
        """."""
        added[key] = value
        return self




use = use()

# Clean up document
clean()
