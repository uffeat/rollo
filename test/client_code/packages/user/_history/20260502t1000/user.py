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
    app = use("@@/app/")
    component = use("@@/component/")
    Login = use("@@/user").Login
    Logout = use("@@/user").Logout
    Signup = use("@@/user").Signup
    get_user = use("@@/user").get_user
    State = use("@@/state", test=meta.test).State
    toast = use("@@/toast/", test=meta.test)

    class user:
        """."""

        def __init__(self):
            state = State()
            self._ = dict(state=state)

        def __call__(self, value):
            if value is not None and not isinstance(value, dict):
                raise ValueError(f"Invalid user value: {value}")
            self._["state"](value)
            if value:
                app.state(user=value)
                toast(
                    "You're in",
                    f"{value.get('email')} logged in",
                    style="success",
                )
            else:
                app.state(user=False)
                toast(
                    "See you soon",
                    f"{self.previous.get('email')} logged out",
                    style="dark",
                )

        @property
        def current(self):
            return self._["state"].current

        @property
        def effect(self):
            return self._["state"].effect

        @property
        def effects(self):
            return self._["state"].effects

        @property
        def previous(self):
            return self._["state"].previous

        def Login(self):
            result = Login()
            log("result:", result, trace="user.Login")  ##
            self(result)

        def Logout(self):
            result = Logout()
            log("result:", result, trace="user.Logout")  ##
            if result is False:
                self(None)

        def Signup(self):
            result = Signup()
            log("result:", result, trace="user.Signup")  ##
            self(result)

    user = user()

    return dict(user=user)
