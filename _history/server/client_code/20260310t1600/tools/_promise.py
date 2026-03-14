from anvil.js import await_promise
from anvil.js.window import Promise as _Promise


class Promise:

    def __init__(self):
        pwr = _Promise.withResolvers()
        self._ = dict(promise=pwr.promise, resolve=pwr.resolve)

    def __call__(self, value=True) -> "Promise":
        """Resolves promise."""
        self._["resolve"](value)
        return self

    def wait(self):
        """Awaits promise and returns resolved value."""
        value = await_promise(self._["promise"])
        return value
