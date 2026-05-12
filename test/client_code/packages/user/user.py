def main(use, *args, **kwargs):

    use("@@/assets/")
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
    app = use("@@/app/", test=meta.test)
    component = use("@@/component/", test=meta.test)
    Login = use("@@/user").Login
    Logout = use("@@/user").Logout
    Signup = use("@@/user").Signup
    get_user = use("@@/user").get_user
    State = use("@@/state", test=meta.test).State
    toast = use("@@/toast/", test=meta.test)

    __file__ = 'user'
    Error = tools.Error

    class user:
        """Controller for user state."""

        def __init__(self):
            state = State(name="user")
            self._ = dict(state=state)

        def __call__(self, value=None):
            ##log("__call__ got value:", value, trace=__file__)  ##
            if value is not None and not isinstance(value, dict):
                Error(f"Invalid user value: {value}", trace=__file__)
            self._["state"](value)
            if value:
                ##log("__call__ sets app state:", value, trace=__file__)  ##
                app.state(user=value)
                ##log("__call__ shows toast", trace=__file__)  ##
                toast(
                    "You're in",
                    f"{value.get('email')} logged in",
                    style="success",
                )
            else:
                app.state(user=False)
                if self.previous:
                    toast(
                        "See you soon",
                        f"{self.previous.get('email')} logged out",
                        style="dark",
                    )

        @property
        def current(self):
            return self._["state"].current

        @property
        def effect(self) -> callable:
            """Decorates user effect."""
            return self._["state"].effect

        @property
        def effects(self) -> type:
            """Returns effects controller."""
            return self._["state"].effects

        @property
        def previous(self):
            return self._["state"].previous

        def Login(self) -> None:
            result = Login()
            ##log("result:", result, trace="user.Login")  ##
            self(result)

        def Logout(self) -> None:
            result = Logout()
            ##log("result:", result, trace="user.Logout")  ##
            if result is False:
                self(None)

        def Signup(self) -> None:
            result = Signup()
            ##log("result:", result, trace="user.Signup")  ##
            self(result)


    user = user()

    return dict(user=user)
