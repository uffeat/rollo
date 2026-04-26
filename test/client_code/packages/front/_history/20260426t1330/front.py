def main(use, *args, **kwargs):

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On = mixins.Base, mixins.Html, mixins.On
    anvil, console, document, js, log, meta, native, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")

    use("assets/tools/iframe.css", test=meta.test)
    Iframe = use("assets/tools/iframe", test=meta.test).Iframe

    class front(Base):
        page = True
        persist = True

        def __init__(self, **options):
            Base.__init__(self)
            self.slot="persist"
            iframe = Iframe(dict(name="front", src=f"{meta.origin}/front"))
            self.node.append(iframe)

    return dict(front=front)
