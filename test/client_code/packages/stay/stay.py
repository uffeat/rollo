def main(use, *args, **kwargs):
    Sheet = use("@/rollo/").Sheet
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

    class stay(Base):

        page = True
        persist = True

        def __init__(self, **options):
            Base.__init__(self)
            self.slot = "persist"
            self.node.classList.add("container", "mt-3")
            self.node.append(component.h1(text="Stayin'..."))

    return dict(stay=stay)

    return dict(about=about)
