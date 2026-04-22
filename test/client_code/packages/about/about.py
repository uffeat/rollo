def main(use, *args, **kwargs):
    Sheet = use("@/rollo/").Sheet
    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, Wrap = mixins.Base, mixins.Html, mixins.On, mixins.Wrap
    anvil, console, document, js, log, meta, native, tools, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.tools,
        use.window,
    )
    component = use("@@/component/")

    setup = use("assets/about/about.js.html", test=meta.test).default

    class about(Html, Base):
        page = True

        def assets() -> dict:
            return dict(
                sheets=[
                    use("assets/about/about.css.html", test=meta.test),
                ],
                template=use(f"assets/about/about.html", test=meta.test),
            )

        def __init__(self, **options):
            Base.__init__(self)
            Html.__init__(self)
            self.node.classList.add("container", "mt-3")

            html = use(
                "assets/about/about.md",
                test=meta.test,
                data=dict(foo="FOO", bar="BAR", color="bs-secondary"),
            )
            wrapped = Wrap(html, parent=self)

            @wrapped.on()
            def click(event):
                log("Clicked")

            setup(self.node)

    return dict(about=about)
