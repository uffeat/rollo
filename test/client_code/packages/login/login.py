def main(use, *args, **kwargs):
    """Replaces login package."""

    Base = use("@@/mixins").Base
    component = use("@@/component/")
    meta = use.meta
    log = use.log
    login_with_form = use.anvil.login_with_form
    __file__ = 'login'

    use("@/frame/")

    def Login():
        row = login_with_form(
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
            caller: str=None,
            options: dict = None,
            origin: str = None,
            page: str = None,
            path: str = None,
            session_id: str = None,
            targets: list = None,
            **query,
        ):
            Base.setup(self)
            self.node.setAttribute(self.__class__.__name__, "")

           
            log('origin', origin)

            if page or meta.IWORKER:
                self.template("components/frame/frame")

                if page:

                    frame = self.node.querySelector("frame-component")
                    login = component.a("nav-link", text="Log in", slot="top", parent=frame)

                    @login.on()
                    def click(event):
                        event.preventDefault()
                        Login()

                    @login.on(once=True)
                    def _connect(event):
                        log("Connected", trace=__file__)  ##
                        Login()

        def __call__(self, *args, **kwargs):
            log('args:', args)
            log('kwargs:', kwargs)
            result = Login()
            return result

    use.console.warn("Using injected login package.")
    return dict(login=login)
