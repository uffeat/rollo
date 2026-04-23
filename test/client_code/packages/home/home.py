def main(use, *args, **kwargs):

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, Wrap = mixins.Base, mixins.Html, mixins.On, mixins.Wrap
    anvil, app, console, document, js, log, meta, native, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")

    class home(Html, Base):

        page = True

        def assets() -> dict:
            return dict(
                template=use("assets/home/home.md", test=meta.test),
            )

        def __init__(self, **options):
            Base.__init__(self)
            Html.__init__(self)
            self.node.classList.add("container", "mt-3")

    return dict(home=home)
