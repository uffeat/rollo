from anvil.js import import_from, new
from anvil.js.window import Blob, Function, URL


def wrap(source, arrow: bool = False, name: str = None, sync: bool = True):
    if not name:
        name = source.__name__
    prefix = "" if sync else "async"
    if arrow:
        wrapped = Function(
            "source",
            f"const {name} = {prefix} (...args) => source(...args); return {name};",
        )(source)

    else:
        wrapped = Function(
            "source",
            f"return {prefix} function {name}(...args) {{ return source(this, ...args); }}",
        )(source)

    wrapped.__name__ = name

    return wrapped


class js:
    def __init__(self):

        class _function:
            def __init__(self, arrow: bool = True, name: str = None, sync: bool = True):
                self.arrow = arrow
                self.name = name
                self.sync = sync

            def __call__(self, source):
                wrapped = wrap(source, arrow=self.arrow, name=self.name, sync=self.sync)
                return wrapped

        self._function = _function

    @property
    def function(self):
        """Returns decrorator that wraps in JS function."""
        return self._function

    @staticmethod
    def module(text: str, path: str = None):
        """Returns constructed JS module (no caching)."""
        if path:
            text = f"{text}\n//# sourceURL={path}"
        url = URL.createObjectURL(new(Blob, [text], {"type": "text/javascript"}))
        result = import_from(url)
        URL.revokeObjectURL(url)
        return result


js = js()
