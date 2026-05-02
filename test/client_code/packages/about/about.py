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
    # XXX Cannot make test-version of "@@/user/" work!!?
    user = use("@@/user/", test=False)

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

            @user_data.state.effect()
            def effect(**change):
                log('change: ', change, trace="effect")  ##

            user_data.state(color='pink')

            





            @user.bind(self)
            def user_effect(message):
                current = message.current
                if isinstance(current, dict):
                    user_data.text = f'User: {current.get("email")}'
                else:
                    user_data.text = "No user"



            @self.effect(connect=True)
            def on_connect(**change) -> None:
                """Connected."""
                ##log("dir", dir(on_connect), trace="on_connect")  ##
                log(on_connect.__doc__, trace="on_connect")  ##
                ##log('annotations: ', on_connect.__annotations__, trace="on_connect")  ##
                ##user.effects.add(user_effect, run=True)


            @self.effect(connect=False)
            def on_disconnect(**change):
                """Disconnected."""
                log(on_disconnect.__doc__, trace="on_disconnect")  ##
                ##user.effects.remove(user_effect)

    return dict(about=about)
