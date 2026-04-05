from ..console import console, log
from ..native import native
from ..patch import patch
from ..works import works


class Slots:
    """Wrapper for slots."""

    def __init__(self, owner):
        self._ = dict(owner=owner)

    def __getitem__(self, name: str):
        """Returns slot object."""
        return self._["owner"].slots.get(name)

    def __getattr__(self, name: str):
        return self[name]

    @property
    def names(self) -> tuple:
        return tuple(self._["owner"].slots.keys())


class Template:
    """Controller for template."""

    def __init__(self, owner):
        self._ = dict(owner=owner, slots=Slots(owner))

    def __call__(self, content: str):
        """Sets template html and slots."""
        if self._.get("content"):
            ...
            ##raise ValueError(f"Cannot change template.")
        content = content.strip()
        self._["content"] = content
        if content.startswith("<"):
            self._["owner"].html = content
        else:
            self._["owner"].html = f"@theme:{content}.html"

    @property
    def content(self) -> str:
        return self._.get("content")

    @property
    def slots(self) -> str:
        return self._["slots"]


class Uid:
    def __init__(self):
        self._ = dict(count=0)

    def __call__(self):
        result = f'anvil-{self._["count"]}'
        self._["count"] += 1
        return result


Uid = Uid()


class Base(works.HtmlTemplate):
    """Base mixin that all components should inherit from."""

    def setup(self, *args, parent=None, slot: str = None, **kwargs):
        node = works.get_dom_node(self)
        # Provide access to component via node
        patch(node).value(self, name="host")
        uid = Uid()
        # Build props that compositions may use
        self._ = dict(node=node, uid=uid)
        # Set attrs
        node.setAttribute("base", "")
        node.setAttribute("uid", uid)
        # Compose template
        self._.update(dict(template=Template(self)))
        # Use setup arguments
        if slot:
            self.slot = slot
        if parent:
            parent.append(self)
        # Enable chaining
        return self

    @property
    def children(self) -> tuple:
        children = works.HtmlTemplate.get_components(self)
        return tuple(children)

    @property
    def node(self):
        return self._["node"]

    @property
    def slot(self):
        return self._.get("slot")

    @slot.setter
    def slot(self, slot):
        if slot == self._.get("slot"):
            # Ignore no change
            return
        if slot:
            self._["slot"] = self.node.slot = slot
        else:
            self._.pop("slot", None)
            self.node.removeAttribute("slot")
        if self.parent:
            # NOTE slot change to parent-assigned component re-appends
            self.remove()
            self.parent.append(self)

    @property
    def template(self):
        return self._["template"]

    @property
    def uid(self):
        return self._.get("uid", "")

    def append(self, *children):
        """Adds components."""
        # NOTE Always invoked when adding component
        for child in children:
            """NOTE Anvil requires that parent-assigned component are removed from parent
            before assigning to new parent, therefore do this automatically."""
            if child.parent:
                child.remove()
            # Send before events
            self.node.dispatchEvent(
                native.CustomEvent("_before_parent", dict(detail=self.node))
            )
            self.raise_event("x-before-parent", parent=self)
            # Add component
            works.HtmlTemplate.add_component(self, child, slot=child.slot or "default")
            child.node.setAttribute("parent", self.uid)
            # Send after events
            self.node.dispatchEvent(
                native.CustomEvent("_after_parent", dict(detail=self.node))
            )
            self.raise_event("x-after-parent", parent=self)
        return self

    def clear(self, *slots):
        if slots:
            for child in self.children:
                if child.slot not in slots:
                    continue
                child.remove()
        else:
            for child in self.children:
                child.remove()
        return self

    def remove(self):
        """Removes from parent."""
        # NOTE Always invoked when removing from parent
        if self.parent:
            parent = self.parent
            # Send before events
            self.node.dispatchEvent(
                native.CustomEvent("_before_remove", dict(detail=parent.node))
            )
            self.raise_event("x-before-remove", parent=parent)
            works.HtmlTemplate.remove_from_parent(self)
            self.node.removeAttribute("parent")
            # Send after events
            self.node.dispatchEvent(
                native.CustomEvent("_after_remove", dict(detail=parent.node))
            )
            self.raise_event("x-after-remove", parent=parent)
        return self

    def add_component(self, *args, **kwargs):
        """."""
        return self.append(*args, **kwargs)

    def remove_from_parent(self, *args, **kwargs):
        """."""
        return self.remove(*args, **kwargs)
