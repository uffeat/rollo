from ..meta import meta
from ..tools import define
from ..works import works
from ._assets import assets




class main(works.HtmlTemplate):
    """Permanent top-level Anvil component."""

    def __init__(self):
        self._ = {}

        # Make node identifiable
        node = works.get_dom_node(self)
        node.setAttribute(self.__class__.__name__, "")
        node.id = "main"
        # Provide access to component via node
        define(node).value(self, name="host")

        self._["node"] = node

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
