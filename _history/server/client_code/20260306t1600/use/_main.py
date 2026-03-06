from ..meta import meta
from ..tools import define
from ..works import works
from ._assets import assets

# Make sure that app-component is registered
assets.get("@/rollo/")


class main(works.HtmlTemplate):
    """Permanent top-level Anvil component."""

    def __init__(self):
        self._ = {}
        if meta.iworker:
            self.html = '<app-component anvil-slot="default"></app-component>'
        else:
            self.html = """
'<app-component>
  <frame-component  anvil-slot="default"></frame-component>
</app-component>
"""

        # Create slot as app-component to get access to resize features

        # Make node identifiable
        node = works.get_dom_node(self)
        node.setAttribute(self.__class__.__name__, "")
        node.id = "main"
        # Provide access to component via node
        define(node).value(self, name="host")
        # Extract app component
        app = node.querySelector("app-component")

        class effect:
            def __init__(self, *conditions, **options):
                self.conditions = conditions
                self.options = options

            def __call__(self, handler):
                app.effects.add(handler, self.conditions, self.options)
                return handler

        self._["app"] = app
        self._["effect"] = effect
        self._["node"] = node

        if not meta.iworker:
            self._["frame"] = node.querySelector("frame-component")

    @property
    def app(self):
        """."""
        return self._["app"]

    @property
    def child(self):
        """."""
        children = self.get_components()
        if children:
            return children[0]

    @child.setter
    def child(self, child):
        """."""
        self.clear()
        if child:
            self.append(child)

    @property
    def children(self):
        """."""
        children = self.get_components()
        return tuple(children)

    @property
    def effect(self):
        """."""
        return self._["effect"]

    @property
    def effects(self):
        """."""
        return self._["app"].effects

    @property
    def frame(self):
        """."""
        return self._.get("frame")

    @property
    def node(self):
        """."""
        return self._["node"]

    def append(self, *children):
        """."""
        for child in children:
            if child.parent:
                child.remove_from_parent()
            self.add_component(child)
        return self

    def clear(self):
        works.HtmlTemplate.clear(self)
        return self
        # Or:
        for child in self.children:
            child.remove_from_parent()
        return self

    def open(self):
        """."""
        current = works.get_open_form()
        if current is self:
            return
        works.open_form(self)
        return self


main = main()
works.open_form(main)
