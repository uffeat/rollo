from ..document import document
from ..native import native
from ..works import works
from ._assets import assets

Component = assets.get("@/rollo/").Component

app = assets.get("@/rollo/").app
document.body.prepend(app)

root = document.getElementById("appGoesHere")
app.append(root)

# NOTE To avoid circular imports, do not inherit from 'Base' (but assume that child does).

class main(works.HtmlTemplate):
    """Permanent top-level Anvil component."""

    def __init__(self):
        node = works.get_dom_node(self)
        node.id = "main"
        node.setAttribute("main", "")

        slot = Component("slot")()
        shadow = Component("div")(dict(id="root"), slot)

        def onslotchange(event):
            """Propagates event."""
            node.dispatchEvent(native.CustomEvent("_change", dict(detail=event)))
            self.raise_event("x-change", event=event)

        slot.addEventListener("slotchange", onslotchange)
        node.attachShadow(dict(mode="open")).append(shadow)

        self._ = dict(node=node)

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
            if child.parent:
                child.remove()
            works.HtmlTemplate.add_component(self, child)

    @property
    def node(self):
        """."""
        return self._["node"]
    
    def add_component(self, *args, **kwargs):
        """."""
        return self.append(*args, **kwargs)

    # Duck-type guard with respect to Base
    def append(self, child, *args, **kwargs):
        """."""
        self.child = child
        return self
    
    def clear(self, *args, **kwargs):
        """."""
        children = self.get_components()
        for child in children:
            child.remove()
        return self

    def open(self):
        """."""
        if works.get_open_form() is not self:
            works.open_form(self)
        return self
    
    def remove(self):
        """."""


main = main()
works.open_form(main)
