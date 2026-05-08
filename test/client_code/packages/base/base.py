def main(use, *args, **kwargs):
    use("@@/assets/")
    works, console, document, js, log, meta, native, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
   
    
    Attributes = use("@@/attributes", test=meta.test).Attributes
    Classes = use("@@/classes", test=meta.test).Classes
    Component = use("@@/component").Component
    Reactive = use("@@/reactive", test=meta.test).Reactive
    
    Css = use("@@/css", test=meta.test).Css

    # Get Bootstrap sheet
    bootstrap = use("@/bootstrap/bootstrap.css")

    cache = {}  # XXX Currently not used


    class Base(works.HtmlTemplate):
        """Base mixin that all components should inherit from."""

        def __init__(self, name: str = ""):
            node = works.get_dom_node(self)
            attributes = Attributes(node)
            classes = Classes(node)
            css = Css(node)
            # Add shadow
            """HACK Attach shadow to node and inject web component to ensure that components
            (regardless of template) always contain a rollo web component. Enables:
            - Access to native web component LC
            - Access to rollo component features such as reactive state
            - Tracking of child addition/removal
            - Shadow tree building
            - Py/JS coms bridge
            """

            # XXX TODO Handle shadow template and shadow sheets

            # NOTE Not pythonized since may be used from JS
            slot = Component("slot")()
            shadow = Component("div")(dict(id="root"), slot)
            # Extract originals
            _onConnect = js.pop(shadow, "onConnect")
            _onDisconnect = js.pop(shadow, "onDisconnect")

            # Create state
            """XXX Remove out-of-the-box effects that reactively update the web component."""
            shadow.effects.clear()
            state = Reactive(shadow.state)

            # Patch-up shadow
            patch(shadow).value(
                node,
                name="node",
            ).value(slot, name="slot")

            # Extract sheets from cls-scoped 'assets' function
            # NOTE Assets are function-wrapped to prevent mutation and to delay import
            sheets = None
            if hasattr(self.__class__, "assets") and callable(self.__class__):
                assets = self.__class__.assets()
                sheets = assets.get("sheets")
                if sheets and not isinstance(sheets, (list, tuple)):
                    sheets = None

            def _on_change(event):
                """Notifies on child addition/removal.
                XXX Only active during connection."""
                self.on_change()
                node.dispatchEvent(native.CustomEvent("_change", dict(detail=event)))
                self.raise_event("x-change", event=event)

            @_onConnect
            def onConnect(*args):
                """Notifies on connection and performs setups."""
                self.on_connect()
                # NOTE slotchange reg/dereg follows LC to guard against memory leaks
                slot.addEventListener("slotchange", _on_change)
                node.dispatchEvent(native.CustomEvent("_connect"))
                self.raise_event("x-connect")
                # Activate (use and enable) sheets
                if sheets:
                    # Hide component until activation of sheets
                    # XXX Mitigates, but does not eliminate FOUC risk
                    shadow.classes.add("invisible")
                    for sheet in sheets:
                        if sheet:
                            # NOTE Sheet tool prevents over-adoption, so ok to 'use'
                            # repeatedly.
                            getattr(sheet, "use", lambda: None)()
                            getattr(sheet, "enable", lambda: None)()
                    shadow.classes.remove("invisible")

            @_onDisconnect
            def onDisconnect(*args):
                """Notifies on disconnection and cleans up."""
                self.on_disconnect()
                slot.removeEventListener("slotchange", _on_change)
                node.dispatchEvent(native.CustomEvent("_disconnect"))
                self.raise_event("x-disconnect")
                # Remove all effects (memory safety)
                state.effects.clear()
                # Disable sheets (faster than 'unuse')
                if sheets:
                    for sheet in sheets:
                        if sheet:
                            getattr(sheet, "disable", lambda: None)()

            node.attachShadow(dict(mode="open")).append(shadow)
            # Add Bootstrap sheet to node's shadowRoot
            bootstrap.use(node)
            # Create uid (use shadow uid)
            uid = shadow.uid
            # Create internal state. NOTE Shared with other mixins; 'private' and
            # 'public' are intended for leaf client only.
            self._ = dict(
                attributes=attributes,
                classes=classes,
                css=css,
                node=node,
                private=dict(),
                public=Data(),
                shadow=shadow,
                state=state,
                uid=uid,
            )
            if name:
                self.name = name
            # Patch-up node
            patch(node).value(
                # Provide access to component via node
                self,
                name="host",
            ).value(shadow, name="shadow")
            # Set attrs
            attributes(base=True, uid=uid)
            attributes[self.__class__.__name__] = True

        def __call__(self, **updates):
            """Updates component."""
            ##log("updates:", updates, trace=__file__)  ##
            for key, value in updates.items():
                if hasattr(self, key):
                    ##log("Own declared key key:", key, trace=__file__)  ##
                    setattr(self, key, value)
                    continue
                if hasattr(self.node, key):
                    ##log("Node key:", key, trace=__file__)  ##
                    self.node[key] = value
                    continue
                if key.startswith("["):
                    ##log("Attribute key:", key, trace=__file__)  ##
                    self.attributes.set(key[1:-1], value)
                    continue
                if key.startswith("."):
                    ##log("Class value:", key, trace=__file__)  ##
                    self.classes(**{key[1:]: value})
                    continue
                if key.startswith("__"):
                    ##log("CSS var key:", key, trace=__file__)  ##
                    self.css.set(key[2:], value)
                if key.startswith("_"):
                    ##log("Own ad-hoc key:", key, trace=__file__)  ##
                    setattr(self, key, value)
                    continue
                ##log("Public key:", key, trace=__file__)  ##
                self.public[key] = value
            return self

        def __getitem__(self, key: str):
            """Returns component prop."""
            return getattr(self, key, None)

        def __setitem__(self, key: str, value):
            """Sets component prop."""
            setattr(self, key, value)

        @property
        def attributes(self):
            return self._["attributes"]

        @property
        def classes(self):
            return self._["classes"]

        @property
        def css(self):
            return self._["css"]

        @property
        def chain(self) -> tuple:
            return tuple(self.__class__.mro())

        @property
        def connected(self) -> bool:
            return self.node.isConnected

        @property
        def detail(self):
            return self.shadow.detail

        @property
        def effect(self) -> callable:
            """Decorates effect."""
            return self.state.effect

        @property
        def effects(self) -> ProxyType:
            """Returns effects controller."""
            return self.state.effects

        @property
        def name(self) -> str:
            return self.node.getAttribute("name") or ""

        @name.setter
        def name(self, name: str):
            self.node.setAttribute("name", name)

        @property
        def node(self):
            return self._["node"]

        @property
        def public(self):
            return self._["public"]

        @property
        def shadow(self):
            return self._["shadow"]

        @property
        def slot(self) -> str:
            return self.node.slot or "default"

        @slot.setter
        def slot(self, slot: str):
            if not slot or slot == "default":
                self.node.removeAttribute("slot")
            else:
                self.node.slot = slot

        @property
        def state(self):
            return self._["state"]

        @property
        def uid(self):
            return self._["uid"]

        def on_change(self):
            """Overload target."""

        def on_connect(self):
            """Overload target."""

        def on_disconnect(self):
            """Overload target."""

        def on_parent(self, *args, current=None, previous=None, **kwargs):
            """Overload target."""

        def on_remove(self, *args, future=None, **kwargs):
            """Overload target."""
            # NOTE Return False to reject removal.

        def add_component(self, *args, **kwargs):
            """Redirect for compatibility."""
            return self.append(*args, **kwargs)

        def append(self, *children, **kwargs):
            """Adds components."""
            for child in children:
                previous = child.parent
                ##log("previous:", previous, trace=__file__)  ##
                if previous:
                    if previous is self:
                        # Ignore if already assigned
                        # NOTE If re-assignment really is desired, explicitly remove first.
                        continue
                    # Notify child and allow abort
                    if hasattr(child, "on_remove"):
                        ok = child.on_remove(future=self)
                        if ok is False:
                            continue
                    # NOTE Anvil does not allow parent re-assignment without prior removal
                    child.remove_from_parent()
                # Get child node
                node = works.get_dom_node(child)
                # Assign
                works.HtmlTemplate.add_component(self, child)
                # Indicate Anvil parent on node
                node.setAttribute("anvil-host", self.uid)
                # Align child node's slot (implicit 'default')
                if node.slot:
                    node.removeAttribute("slot")
                # Notify child
                if hasattr(child, "on_parent"):
                    child.on_parent(current=self, previous=previous)
            return self

        def children(self, *args, **kwargs) -> list:
            """Returns added children, optionally filtered."""
            children = works.HtmlTemplate.get_components(self)
            selector = next(iter(args), None)
            if selector:
                if callable(selector):
                    return [
                        c for index, c in enumerate(children) if selector(c, index=index)
                    ]
                if isinstance(selector, str):
                    return [c for c in children if works.get_dom_node(c).matches(selector)]
                console.error("Invalid selector:", selector)
            return children

        def clear(self, *args, **kwargs):
            """Removes children, optionally subject to predicate."""
            # NOTE Removal takes place by calling children's 'remove_from_parent'.
            # NOTE Children get notified before actual removal and may reject removal.
            first: str = next(iter(args), None)
            if first and first.startswith("?"):
                selector = first[1:]
                children = self.children(selector)
                for child in children:
                    child.remove_from_parent()
            else:
                # XXX Slotless assumed -> slot-specific clearing attempt ignored.
                # Remove all children
                children = self.children()
                for child in children:
                    child.remove_from_parent()
            return self

        def remove(self, *args, **kwargs):
            """Removes from parent."""
            # NOTE Called directly or indirectly by parent's 'clear' or a new parent's 'append'.
            ##log("'remove' called", trace=__file__)  ##
            if self.parent:
                ok = self.on_remove()
                if ok is not False:
                    works.HtmlTemplate.remove_from_parent(self)
            return self

        def remove_from_parent(self, *args, **kwargs):
            """Redirect for compatibility."""
            return self.remove(*args, **kwargs)




    return dict(Css=Css)
