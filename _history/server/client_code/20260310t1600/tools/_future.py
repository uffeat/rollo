from anvil.js import await_promise
from anvil.js.window import Promise, clearTimeout, setTimeout


class Future:

    def __init__(self, name: str = None, value=...):
        pwr = Promise.withResolvers()
        self._promise = pwr.promise
        self._resolve = pwr.resolve

        self._timer = None
        self._name = name
        self._value = value

    def __call__(self, *args, **kwargs) -> "Future":
        """Resolves to default."""
        self.resolve()
        return self

    @property
    def __name__(self) -> str:
        """Returns name."""
        return self._name

    @property
    def name(self) -> str:
        """Returns name."""
        return self._name

    @property
    def timer(self) -> str:
        """Returns timer id."""
        return self._timer

    @property
    def value(self):
        """Returns fulfilled value."""
        return self._value

    def resolve(self, value=True) -> None:
        """Resolves promise."""
        check_value(value)
        clear_timer(self)
        self._value = value
        self._resolve(value)

    def resolve_on(self, target, type: str) -> "Future":
        """Resolves by event."""

        def handler(event):
            self.resolve(value=getattr(event, "detail", True))

        target.addEventListener(type, handler, dict(once=True))
        return self

    def wait(self, *args, timeout: int = None):
        """Awaits promise.
        NOTE 'args' for pseudo arguments."""
        if timeout is not None:

            def ontimeout():
                self.resolve(Exception("timeout"))

            self._timer = setTimeout(ontimeout, timeout)

        value = await_promise(self._promise)
        return value


def check_value(value) -> None:
    if value is ...:
        message = f"'{...}' is reserved for initial value (trace: {__file__})."
        raise ValueError(message)


def clear_timer(owner: Future) -> None:
    if owner.timer:
        clearTimeout(owner.timer)
