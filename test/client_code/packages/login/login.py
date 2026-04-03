def main(use, *args, **kwargs):
    """Replaces login package."""

    Base = use("@@/mixins").Base
    component = use("@@/component/")

    use("@/frame/")

    def Login():
        row = use.anvil.login_with_form(
            allow_cancel=True,
            allow_remembered=False,
            remember_by_default=False,
            show_signup_option=True,
        )
        if row:
            return row["email"]

    class login(Base):
        def __init__(
            self,
            *args,
            origin: str = None,
            page: str = None,
            path: str = None,
            session_id: str = None,
            targets: list = None,
            **query,
        ):
            Base.setup(self)
            self.node.setAttribute(self.__class__.__name__, "")

            if page:
                self.template("components/frame/frame")

                frame = self.node.querySelector("frame-component")

                login = component.a("nav-link", text="Log in", slot="top", parent=frame)

                @login.on()
                def click(event):
                    event.preventDefault()
                    Login()

                @login.on(once=True)
                def _connect(event):
                    use.log("Connected", trace=__file__)  ##
                    Login()

        def __call__(self, *args, **kwargs):
            result = Login()
            return result

    use.console.warn("Using injected login package.")
    return dict(login=login)
