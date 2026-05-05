def main(use, *args, **kwargs):
    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, initialize = mixins.Base, mixins.Html, mixins.On, mixins.initialize
    anvil, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.packages,
        use.tools,
        use.window,
    )
    app = use("@@/app/")
    component = use("@@/component/")

    class index(Base):

        page = True
        persist = True

        def __init__(self, **options):
            initialize(self, Base)

            srcdoc = use(f"assets/index/index.html", raw=True, test=True)
            log("srcdoc:", srcdoc)
            iframe = component.iframe(srcdoc=srcdoc)

            iframe = component.iframe(src=f"/index/index?test=true")




            self.node.append(iframe)

    return dict(index=index)

