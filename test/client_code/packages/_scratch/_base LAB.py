from ..case import camel_to_kebab
from ..console import console, log
from ..native import native
from ..patch import patch
from ..works import works


class Attributes:
    """Controller for node attributes."""

    def __init__(self, node):
        """."""
        self._ = dict(node=node)

    def __call__(self, **updates):
        node = self._["node"]
        for key, value in updates.items():
            _key = camel_to_kebab(key)
            if value in [False, None]:
                node.removeAttribute(_key)
                continue
            if value is True:
                node.setAttribute(_key, "")
                continue
            node.setAttribute(_key, value)

    def __getitem__(self, key: str):
        node = self._["node"]
        key = camel_to_kebab(key)
        if not node.hasAttribute(key):
            return
        value = node.getAttribute(key)
        if value == "":
            return True
        try:
            return int(value)
        except:
            try:
                return float(value)
            except:
                return value

    def __getattr__(self, key: str):
        return self[key]


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

    def setup(self):
        owner = self
        node = works.get_dom_node(self)



        # XXX TODO Purge native options -> Auto and/or fire both; delegate

        class on:
            def __init__(
                self,
                *args,
                once: bool = False,
                run: bool = False,
            ):
                self.args = args
                self.once = once
                self.run = run

            def __call__(self, handler):
                event_name: str = next(iter(self.args), handler.__name__)
                

                if event_name.startswith("x") or event_name in ["hide", "show"]:
                    # Synthetic Anvil event
                    event_name = event_name.replace("_", "-")
                    if self.once:
                        def wrapper(**event):
                            handler(**event)
                            owner.remove_event_handler(event_name, wrapper)
                        owner.add_event_handler(event_name, wrapper)
                    else:
                        owner.add_event_handler(event_name, handler)
                    if self.run:
                        handler(dict(event_name=event_name, sender=owner))
                else:
                    node.addEventListener(event_name, handler, dict(once=self.once))
                    if self.run:
                        handler(native.CustomEvent(event_name))
                return handler

        # Provide access to component via node
        patch(node).value(self, name="host")

        uid = Uid()
        # Build props that compositions may use
        self._ = dict(node=node, on=on, uid=uid)
        # Compose
        attributes = Attributes(node)
        self._.update(dict(attributes=attributes, template=Template(self)))
        # Set attrs
        attributes(base=True, uid=uid)
        return self

    @property
    def attributes(self):
        return self._["attributes"]

    @property
    def children(self) -> tuple:
        children = works.HtmlTemplate.get_components(self)
        return tuple(children)

    @property
    def node(self):
        return self._["node"]

    @property
    def on(self) -> callable:
        return self._["on"]

    @property
    def slot(self) -> str:
        return self._.get("slot")

    @slot.setter
    def slot(self, slot: str):
        if slot != self._.get("slot"):
            # slot change
            self.attributes(slot=slot)
            self._["slot"] = slot
            if self.parent:
                # NOTE slot change to parent-assigned component removes
                self.remove()

    @property
    def template(self):
        return self._["template"]

    def append(self, *children):
        """Adds components."""
        # NOTE Always invoked when adding component
        for child in children:
            """NOTE Anvil requires that parent-assigned component are removed from parent
            before assigning to new parent, therefore do this automatically."""
            if child.parent:
                child.remove()
            slot = child.slot or "default"
            # Send before events
            self.node.dispatchEvent(
                native.CustomEvent("_before_parent", dict(detail=self.node))
            )
            self.raise_event("x-before-parent", parent=self)
            works.HtmlTemplate.add_component(self, child, slot=slot)
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
            # Send after events
            self.node.dispatchEvent(
                native.CustomEvent("_after_remove", dict(detail=parent.node))
            )
            self.raise_event("x-after-remove", parent=parent)
        return self
    
    def add_event_handler(self, event_name: str, handler, once=False, run=False):
        """."""
        self.node.addEventListener(event_name, handler, dict(once=once))


        if event_name.startswith('x') or event_name in ["hide", "show"]:
            works.HtmlTemplate.add_event_handler(event_name, handler)
        else:
            ...

        return handler

        

        


    def remove_event_handler(self, event_name, handler):
        """."""

    def add_component(self, *args, **kwargs):
        """."""
        return self.append(*args, **kwargs)

    def remove_from_parent(self, *args, **kwargs):
        """."""
        return self.remove(*args, **kwargs)
