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
    Classes = use("@@/classes", test=meta.test)
    Css = use("@@/css", test=meta.test).Css
    Component = use("@/rollo/").Component
    patch = use("@@/patch/")
    Reactive = use("@@/reactive", test=meta.test).Reactive
    # XXX Use 'Component' rather than 'component', since Anvil messes up some JS proxies
    Component = use("@/rollo/").Component
    htmlToComponent = use("@/rollo/").htmlToComponent

    def set_html(target, html: str):
        """Sets target html and converts all descendants to web components."""
        # NOTE target does not have to be a web component
        target.append(*htmlToComponent(html))
        return target
    
    def pythonize(target):
        if target.hasAttribute("pythonized") or not hasattr(target, "update"):
            return target

        # Harvest originals
        _update = target.update
        # Extract originals
        _onConnect = js.pop(target, "onConnect")
        _onDisconnect = js.pop(target, "onDisconnect")

        def html(html: str):
            """Appends components from html with all components converted to
            (non-pythonized) web components."""
            return set_html(target, html)

        def update(*args, **updates):
            """Updates component from updates and/or first pos arg."""
            # XXX component could update during pythonization -> pos arg important
            _update(updates.update(dict(next(iter(args), {}))) or updates)
            return target

        class on:
            """Decorates event handler."""

            def __init__(self, *types, **options):
                self.types = types
                self.options = options

            def __call__(self, handler: callable) -> callable:
                if not self.types:
                    self.types = [handler.__name__]
                # XXX class-based handlers are not suitable for decorator-stacking
                if isinstance(handler, type):
                    handler = handler()
                for t in self.types:
                    target.addEventListener(t, handler, self.options)
                return handler

        state = Reactive(target.state)

        # Patch-up target
        patch(target).value(state.effect, name="effect").value(
            state.effects, name="effects"
        ).value(html).value(on).value(state, name="state").value(update)

        def onDisconnect(*args):
            state.effects.clear()

        _onDisconnect(onDisconnect)

        target.attribute.pythonized = True
        return target




    class component:

        def __getattr__(self, tag: str) -> callable:
            return self[tag]

        def __getitem__(self, tag: str) -> callable:
            """Returns instance factory for component of a given tag."""
            if tag[0].isupper():
                return lambda *args, **kwargs: Component(tag.lower())(*args).update(kwargs)
            return lambda *args, **kwargs: pythonize(Component(tag)(*args)).update(**kwargs)

        def html(self, *args, **updates):
            """Returns nested web components from html."""
            if len(args) == 1:
                return set_html(self["div"](**updates), args[0])
            tag, html = args
            tag, *rest = tag.split(".")
            return set_html(self[tag](".".join(rest), **updates), html)


    component = component()





    return dict(Css=Css)
