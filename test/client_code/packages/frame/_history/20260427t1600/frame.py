def main(use, *args, **kwargs):

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, initialize = mixins.Base, mixins.Html, mixins.On, mixins.initialize
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
    user = use("@@/user")
    Login, Logout, Signup, get_user = (
        user.Login,
        user.Logout,
        user.Signup,
        user.get_user,
    )
    effect = use("@@/state").effect
    toast = use("@@/toast/", test=meta.test)

    # Register frame component
    use("@/frame/")
    use("assets/frame/frame.css", test=meta.test)

    # CSS classes
    LINK_LIGHT = "link-light"
    NAV_LINK = "nav-link"
    NAV_LINK_LIGHT = f"{NAV_LINK}.{LINK_LIGHT}"
    SELECTOR = ":is(a[path].nav-link)"

    class Router:
        def __init__(self, base: str = ''):
            """."""
            self._ = dict()
            if base:
                self._.update(base=base)

        def __call__(self, path: str):
            ##log("Incoming path:", path, trace="router")  ##
            # Normalize path -> remove trailing '/', but preserve '/'-path
            if path != "/" and path.endswith("/"):
                path = path[:-1]
            ##log("Normalized path:", path, trace="router")  ##
            # Extract page
            parts = path.split("/")
            ##log("parts:", parts, trace="router")  ##
            page = parts[1]
            ##log("page:", page, trace="router")  ##
            # Enable links
            _path = self._.get("current_path")
            self._["previous_path"] = _path
            if _path:
                links = app.querySelectorAll(f'a.{NAV_LINK}[path="{_path}"]')
                if links:
                    for link in links:
                        link.classList.remove("disabled")
            # Create route path from page
            _path = f"/{page}"
            # Hook up to reactive state
            app.state.update(dict(path=_path))
            # Disable links
            self._["current_path"] = _path
            links = app.querySelectorAll(f'a.{NAV_LINK}[path="{_path}"]')
            if links:
                for link in links:
                    link.classList.add("disabled")
            ##log("path:", path, trace="router, before push")  ##
            ##log("pathname:", native.location.pathname, trace="router, before push")  ##
            if path != native.location.pathname:
                ##log("Previous index:", self.index, trace="router, before push")  ##
                index = self.index + 1
                ##log("Current index:", index, trace="router, before push")  ##
                native.history.pushState(
                    {"index": index}, "", f"{path}{native.location.search}"
                )
            # Handle view
            if not page:
                page = "home"
            use(f"@@/{page}/", test=meta.test)

        @property
        def base(self) -> str:
            return self._.get("base", "")

        @property
        def index(self) -> int:
            return getattr(native.history.state, "index", 0)

        @property
        def size(self) -> int:
            return native.history.length

        def use(self):
            @window.on()
            def popstate(event):
                # Store previous index to enable nav direction detection
                self._["previous_index"] = self.index
                self(native.location.pathname)
            path: str = native.location.pathname
            log("Initial path:", path, trace="router.use")  ##
            if self.base:
                ...
            else:
                ...
            url = f"{path}{native.location.search}"
            native.history.replaceState({"index": 0}, "", url)
            self(path)

    class frame(Html, Base, On):

        def __init__(
            self, *args, base: str = "", parts: tuple = None, path: str = "", **kwargs
        ):
            owner = self
            initialize(self, Base, Html, On)
            self.node.id = "main"
            # Set template
            self.template(use("assets/frame/frame.html", test=meta.test))

            # Add import engine processor for page packages
            @use.processor(f"page.py")
            def handler(
                cls,
                *args,
                owner=None,
                path=None,
                **kwargs,
            ):
                """Instantiates and adds page component to frame on import."""
                # NOTE CSS ensures that 'persist' slot is hidden when 'default' slot is not empty
                # Remove non-persisting children
                self.clear("default")
                # Check if persisting (on class to avoid redundant instantiation)
                if getattr(cls, "persist", False):
                    # Hide any previous
                    previous = self.template.nodes.persist.querySelector(
                        ".anvil-component[active]"
                    )
                    if previous:
                        previous.removeAttribute("active")
                    # Check if child exists
                    node = self.template.nodes.persist.querySelector(
                        f".anvil-component[{path.stem}]"
                    )
                    if node:
                        # Get component instance from node
                        child = node.host
                    else:
                        # Create and add child
                        child = (
                            cls(*args, **kwargs)
                            if "__init__" in cls.__dict__
                            else cls()
                        )
                        # Ensure correct slot (even if not declared in component)
                        child.slot = "persist"
                        self.append(child)
                        node = child.node
                    # Show
                    node.setAttribute("active", "")
                else:
                    # Create and add child
                    child = (
                        cls(*args, **kwargs) if "__init__" in cls.__dict__ else cls()
                    )
                    self.append(child)
                result = child(*args, **kwargs) if callable(child) else None
                return result

            # Set up user state
            # NOTE 'user' parcel takes care of link visibility
            @tools.on(
                component.nav(
                    "nav.d-flex",
                    component.a(
                        NAV_LINK_LIGHT,
                        text="Log out",
                        _action=Logout,
                        **{"[user]": True},
                    ),
                    component.a(NAV_LINK_LIGHT, text="Log in", _action=Login),
                    component.a(NAV_LINK_LIGHT, text="Sign up", _action=Signup),
                    slot="top",
                    parent=self.template.nodes.frame,
                )
            )
            def click(event):
                event.preventDefault()
                if not hasattr(event.target, "_action"):
                    return
                user = event.target._action()
                if user:
                    app.state.update(dict(user=user))
                else:
                    if user is False:
                        app.state.update(dict(user=False))
                    # NOTE None-user -> do nothing.

            @effect(app.state, "user")
            class user:
                """Stateful effect for launching toasts."""

                def __init__(self):
                    self._ = dict()

                def __call__(self, change, message):
                    self._.update(
                        current=js.pythonize(change.user),
                        previous=js.pythonize(
                            getattr(message.owner.previous, "user", None)
                        ),
                    )
                    if self.current:
                        toast(
                            "Welcome",
                            f"{self.current.get('email')} logged in",
                            style="success",
                        )
                    else:
                        if self.previous:
                            toast(
                                "See you soon",
                                f"{self.previous.get('email')} logged out",
                                style="dark",
                            )

                @property
                def current(self):
                    return self._.get("current")

                @property
                def previous(self):
                    return self._.get("previous")

            # Set up router
            router = Router(base=base)

            # Nav links -> updates currentPage state
            @tools.on(
                self.template.nodes.home,
                component.nav(
                    "nav.d-flex.flex-column",
                    component.a(NAV_LINK, text="About", **{"[path]": "/about"}),
                    component.a(NAV_LINK, text="Front", **{"[path]": "/front"}),
                    component.a(NAV_LINK, text="Stats", **{"[path]": "/stats"}),
                    component.a(NAV_LINK, text="No path"),
                    slot="side",
                    parent=self.template.nodes.frame,
                ),
            )
            def click(event):
                event.preventDefault()
                target = (
                    event.target
                    if event.target.matches(SELECTOR)
                    else event.target.closest(SELECTOR)
                )
                if not target:
                    return
                path = target.getAttribute("path")
                ##log("path:", path, trace="click")  ##
                router(path)

            anvil.open_form(self)
            router.use()

    return dict(frame=frame)
