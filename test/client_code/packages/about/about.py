def main(use, *args, **kwargs):
    Sheet = use("@/rollo/").Sheet
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
    user = use("@@/user/", test=meta.test)

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



            user_data = component.output(parent=self.node)


            
            @user.effect(component=self)
            def user_effect(current):
                """."""
                log('current:', current, trace='user_effect')
                if current:
                    user_data.text = current.get('email')
                else:
                     user_data.text = 'No user'


            

            @self.effect(connect=True)
            def on_connect(**change):
                log('Connected', trace='on_connect')

            @self.effect(connect=False)
            def on_disconnect(**change):
                log('Disconnected', trace='on_disconnect')
               

            



    return dict(about=about)
