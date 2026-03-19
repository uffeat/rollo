from ..console import console, log
from ..document import document
from ..meta import meta
from ..native import native
from .. import tools
from ..window import window
from ..works import works
from ._assets import assets, compose, processor, source, transformer
from ._main import app, main, root
from ._packages import packages
from ._server import rpc
from . import _own as _

document.documentElement.dataset.bsTheme = "dark"

added = {}
assets.anvil = works
assets.compose("packages", packages)


_ = dict(
    anvil=works,
    app=app,
    api=NotImplementedError,
    assets=assets,
    compose=compose,
    console=console,
    document=document,
    main=main,
    meta=meta,
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
    def __call__(self, specifier, *args, **options):
        if specifier in added:
            return added["specifier"]
        


        # Enable package injection by local server in DEV
        if meta.DEV and 'test' in options and specifier.startswith(f"{packages.key}/"):
            try:
                key, member = packages.parse(specifier)

                ##log("key:", key, trace=__file__)  ##
                ##log("member:", member, trace=__file__)  ##

                text = works.server.call("_package", key)
                main = tools.construct_function(text)
                package = main(self)
                if member:
                    return package[member]
                return package
            except:
                pass

        result = assets.get(specifier, options, *args)
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


@tools.macro()
def clean():
    for id in ["anvil-badge", "anvil-header"]:
        element = document.getElementById(id)
        if element:
            element.remove()
        else:
            if meta.DEV:
                console.warn("Could not find element with id:", id)
