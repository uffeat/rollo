def main(use, *args, **kwargs):
    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, Wrap, initialize = (
        mixins.Base,
        mixins.Html,
        mixins.On,
        mixins.Wrap,
        mixins.initialize,
    )
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
    app = use("@@/app/", test=meta.test)
    component = use("@@/component/")


    

    

    # BUG Cannot make test-version of "@@/user/" work!!?
    user = use("@@/user/", test=meta.test)


    sheet = use("assets/about/about.css", test=meta.test).sheet
    sheet.disabled = True
    ##console.dir(sheet)##

    

    setup = use("assets/about/about.js.html", test=meta.test).default
    user_data = component.output()

    @user.effect(run=True)
    def user_effect(message):
        current = message.current
        log('current:', current, trace="user_effect")##
        if isinstance(current, dict):
            user_data.text = f'User: {current.get("email")}'
        else:
            user_data.text = "No user"

    class about(Html, Base):
        page = True

        def assets() -> dict:
            return dict(
                sheets=[
                    use("assets/about/about.css.html", test=meta.test),
                ],
                template=use("assets/about/about.html", test=meta.test),
            )

        def __init__(self, **options):
            initialize(self, Base, Html)
            self.classes.add("container.mt-3")

            html = use(
                "assets/about/about.md",
                test=meta.test,
                data=dict(foo="FOO", bar="BAR", color="bs-secondary"),
            )
            self.public.foo = component.html(html, parent=self.node)

            @self.public.foo.on()
            def click(event):
                log("Clicked", trace='click')  ##

            self.node.append(user_data)

            @self.effect(_connect=True)
            def on_connect(**change) -> None:
                """Connected."""
                log(on_connect.__doc__, trace="on_connect")  ##

            @self.effect(_connect=False)
            def on_disconnect(**change):
                """Disconnected."""
                log(on_disconnect.__doc__, trace="on_disconnect")  ##

            setup(self.node)

            self(__height="300px", **{"[foo]": 42, ".test": True})

    return dict(about=about)
