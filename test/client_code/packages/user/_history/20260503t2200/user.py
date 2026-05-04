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

    __file__ = 'user'
    Error = tools.Error

    class user:
        """Controller for user state."""

        def __init__(self):
            owner = self
            state = State(name="user")

            class bind:
                def __init__(self, component):
                    self.component = component

                def __call__(self, effect):
                    component = self.component

                    @component.effect(connect=True)
                    def on_connect(**change):
                        owner.effects.add(effect, run=True)

                    @component.effect(connect=False)
                    def on_disconnect(**change):
                        owner.effects.remove(effect)

            self._ = dict(bind=bind, state=state)

        def __call__(self, value=None):
            ##log("value:", value, trace="user.__call__")  ##
            if value is not None and not isinstance(value, dict):
                Error(f"Invalid user value: {value}", trace=__file__)
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

        @property
        def bind(self):
            """Decorates effect that registers/deregister as per component LC."""
            return self._["bind"]
        
    user = user()

    return dict(user=user)
