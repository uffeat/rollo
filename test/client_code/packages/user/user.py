def main(use, *args, **kwargs):

    use("@@/assets/")
    anvil, app, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.app,
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
    component = use("@@/component/")
    Login = use("@@/user").Login
    Logout = use("@@/user").Logout
    Signup = use("@@/user").Signup
    get_user = use("@@/user").get_user

    effect = use("@@/state").effect

    toast = use("@@/toast/", test=meta.test)

    Special = tools.Special



    Ref = use("@/rollo/").Ref

    class user:

        # NOTE 'user' parcel takes care of link visibility

        def __init__(self):
            owner = self
            state = Ref.create()

            if js.instance(state, Ref, strict=False):
                log("state is Ref", trace="user.__init__")##


            class effect:
                def __init__(self, *args, **options):
                    self.component = next(iter(args), None)
                    self.options = options

                def __call__(self, handler: callable):
                    special = Special(handler)
                    if isinstance(handler, type):
                        handler = handler()

                    @special.target()
                    def wrapper(current, message):
                        return handler(current)
                    
                    if self.component:
                        # Set up effect to follow component LC
                        # NOTE Components wipe own effects on disconnect (memory safe)
                        # Default: Run on registration
                        options = dict(run=True)
                        options.update(self.options)
                        
                        @self.component.effect(connect=True)
                        def add(**change):
                            state.effects.add(wrapper, options)

                        @self.component.effect(connect=False)
                        def remove(**change):
                            state.effects.remove(wrapper)

                    else:
                        # Default: Do not run on registration
                        options = dict(run=False)
                        options.update(self.options)
                        state.effects.add(wrapper, options)
                    return wrapper

            self._ = dict(effect=effect, state=state)

            @effect()
            def sync_to_app(current):
                log("current:", current, trace="effect")##
                if current:
                    app.state.update(dict(user=current))
                else:
                    if current is False:
                        app.state.update(dict(user=False))
                    # NOTE None-user -> do nothing.

            @effect()
            def show_toast(current):
                if current:
                    toast(
                        "You're in",
                        f"{current.get('email')} logged in",
                        style="success",
                    )
                else:
                    if owner.previous:
                        toast(
                            "See you soon",
                            f"{owner.previous.get('email')} logged out",
                            style="dark",
                        )

        @property
        def current(self):
            return self.state.current

        @property
        def effect(self):
            return self._["effect"]

        @property
        def effects(self):
            return self.state.effects

        @property
        def previous(self):
            return self.state.previous

        @property
        def state(self):
            return self._["state"]

        def Login(self):
            result = Login()
            log("result:", result, trace="user.Login")##
            result = js.pythonize(result)
            self.state.update(result)

        def Logout(self):
            result = Logout()
            log("result:", result, trace="user.Logout")##
            result = js.pythonize(result)
            self.state.update(result)

        def Signup(self):
            result = Signup()
            log("result:", result, trace="user.Signup")##
            result = js.pythonize(result)
            self.state.update(result)


        def bind(self, component):
            """."""

    user = user()

    return dict(user=user)
