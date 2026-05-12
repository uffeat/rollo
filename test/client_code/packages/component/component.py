def main(use, *args, **kwargs):
    __file__ = "component"
    use("@@/assets/")
    console, document, js, log, meta, window = (
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.window,
    )

    compose = use("@@/compose/", test=meta.test)
    mixup = use("@@/mixup/", test=meta.test)
    patch = use("@@/patch/", test=meta.test)
    _on = use("@@/on/", test=meta.test)

    # XXX Use 'Component' rather than 'component', since Anvil messes up some JS proxies
    Component = use("@/rollo/").Component
    from_html = use("@/rollo/").htmlToComponent

    def set_html(target, html: str):
        """Sets target html and converts all descendants to web components."""
        # NOTE target does not have to be a web component
        target.append(*from_html(html))
        return target

    def pythonize(target):
        if target.hasAttribute("pythonized") or not hasattr(target, "update"):
            return target
        # Extract originals
        _update = js.pop(target, "update")

        @compose(target)
        def html(html: str):
            """Appends components from html with all components converted to
            (non-pythonized) web components."""
            set_html(target)
            return target

        @patch(target)
        class on(_on):

            def __init__(self, *types, **options):
                _on.__init__(self, target, *types, **options)

        @compose(target)
        def update(*args, **updates):
            """Updates component from updates or first pos arg."""
            # XXX component could update during pythonization -> pos arg important
            _update(updates.update(dict(next(iter(args), {}))) or updates)
            return target

        ##log("About to set up onDisconnect", trace=__file__)  ##

        ##log("About to set pythonized attribute", trace=__file__)  ##
        target.attribute.pythonized = True
        return target

    class component:

        def __getattr__(self, tag: str) -> callable:
            return self[tag]

        def __getitem__(self, tag: str) -> callable:
            """Returns instance factory for component of a given tag."""
            if tag[0].isupper():
                return lambda *args, **kwargs: Component(tag.lower())(*args).update(
                    kwargs
                )
            return lambda *args, **kwargs: pythonize(Component(tag)(*args)).update(
                **kwargs
            )

        def html(self, *args, **updates):
            """Returns nested web components from html."""
            if len(args) == 1:
                return set_html(self["div"](**updates), args[0])
            tag, html = args
            tag, *rest = tag.split(".")
            return set_html(self[tag](".".join(rest), **updates), html)

    component = component()

    return dict(
        Component=Component, component=component, pythonize=pythonize, set_html=set_html
    )
