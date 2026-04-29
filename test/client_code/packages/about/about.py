def main(use, *args, **kwargs):
    Sheet = use("@/rollo/").Sheet
    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, Wrap, initialize = (
        mixins.Base,
        mixins.Html,
        mixins.On,
        mixins.Wrap,
        mixins.initialize,
    )
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
    user = use("@@/user/", test=meta.test)

    setup = use("assets/about/about.js.html", test=meta.test).default

    # Put cross-view persisting state here or in classmethod

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
            initialize(self, Base, Html)
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

            user_data = component.output(parent=self.node)



            @user.effect(self)
            def show_user(current):
                ##log("current:", current, trace="show_user")  ##
                if current:
                    user_data.text = current.get("email")
                else:
                    user_data.text = "No user"

            @self.effect(connect=True)
            def on_connect(**change) -> None:
                """Connected."""
                ##log("dir", dir(on_connect), trace="on_connect")  ##
                log(on_connect.__doc__, trace="on_connect")  ##
                log('annotations: ', on_connect.__annotations__, trace="on_connect")  ##
                

            @self.effect(connect=False)
            def on_disconnect(**change):
                """Disconnected."""
                log(on_disconnect.__doc__, trace="on_disconnect")  ##

    return dict(about=about)
