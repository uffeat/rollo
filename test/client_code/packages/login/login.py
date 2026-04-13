def main(use, *args, **kwargs):
    __file__ = "login"
    console, document, log, meta = use.console, use.document, use.log, use.meta

    rollo = use("@/rollo/")
    use("@/frame/")

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On = mixins.Base, mixins.Html, mixins.On
    component = use("@@/component/")
    Login = use("@@/user:Login")

    class login(Base, Html):
        page = True

        def __init__(
            self,
            *args,
            page: str = None,
            **kwargs,
        ):
            Base.__init__(self)

            if page or meta.IWORKER:
                Html.__init__(self)
                self.template("assets/components/frame/frame.html")

                if page:
                    frame = self.node.querySelector("frame-component")
                    login = component.a(
                        "nav-link", text="Log in", slot="top", parent=frame
                    )

                    @login.on()
                    def click(event):
                        event.preventDefault()
                        Login()

                    @login.on(once=True)
                    def _connect(event):
                        log("Connected", trace=__file__)  ##
                        Login()

        def __call__(self, *args, **kwargs):
            log("args:", args)
            log("kwargs:", kwargs)
            result = Login()
            return result

    return dict(login=login)
