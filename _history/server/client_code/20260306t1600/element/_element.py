from anvil.js.window import document
from ..tools import on
from ._update_element import update_element


class element:
    """Utility for creating HTML elements.
    NOTE Intended for light use."""

    def __getattr__(self, arg: str) -> callable:
        return self[arg]

    def __getitem__(self, arg: str) -> callable:
        tag, *classes = arg.split(".")

        def create(*args, **kwargs):
            instance = document.createElement(tag)
            if classes:
                instance.classList.add(*classes)
            update_element(instance, *args, **kwargs)

            return instance

        return create

    @property
    def on(self):
        return on


element = element()
