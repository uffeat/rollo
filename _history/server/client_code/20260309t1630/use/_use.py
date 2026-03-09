from ..console import console, log
from ..document import clean, document
from ..meta import meta
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

app = main.app


class effect:
    """Decorates effect on root element"""

    def __init__(self, *conditions, **options):
        self.conditions = conditions
        self.options = options

    def __call__(self, handler):
        app.effects.add(handler, self.conditions, self.options)
        return handler


_ = dict(
    anvil=works,
    app=app,
    api=NotImplementedError,
    assets=assets,
    compose=compose,
    console=console,
    document=document,
    effect=effect,
    main=main,
    meta=meta,
    native=native,
    packages=packages,
    processor=processor,
    rpc=rpc,
    source=source,
    tools=tools,
    transformer=transformer,
    window=window,
)


class use:
    def __call__(self, specifier, *args, test=False, **kwargs):
        if specifier in added:
            return added["specifier"]

        # Enable package injection by local server in DEV
        if meta.DEV and test and specifier.startswith(f"{packages.key}/"):
            try:
                key, member = packages.parse(specifier)
                log("key:", key)  ##
                log("member:", member)  ##
                text = works.server.call("_package", key)
                main = tools.construct_function(text)
                package = main(self)
                if member:
                    return package[member]
                return package
            except:
                pass

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
