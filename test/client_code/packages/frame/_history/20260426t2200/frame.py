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
    SELECTOR = ":is(a[page].nav-link)"

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

            """Set up router.
            NOTE Using app state for routing enables:
            - Attribute-based page-specific styling; e.g., page="about" -> state-current-page="about" 
            attr on app.
            - Accessible from JS (without module import).
            XXX Use 'currentPage' key (rather than 'page') to avoid collision with CSS prop.
            """

            # Nav links -> updates currentPage state
            @tools.on(
                self.template.nodes.home,
                component.nav(
                    "nav.d-flex.flex-column",
                    component.a(NAV_LINK, text="About", **{"[page]": "about"}),
                    component.a(NAV_LINK, text="Front", **{"[page]": "front"}),
                    component.a(NAV_LINK, text="Stats", **{"[page]": "stats"}),
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
                page = target.getAttribute("page")
                app.state.update(dict(currentPage=page))

            ##log("base:", base)  ##

            @effect(app.state, "currentPage")
            class navs:
                """Controls history and page-display from currentPage."""

                def __init__(self):
                    """."""

                def __call__(self, change, message):
                    """."""
                    current = change.currentPage
                    ##log("current:", current)  ##
                    previous = getattr(message.owner.previous, "currentPage", None)
                    ##log("previous:", previous)  ##
                    if previous:
                        links = owner.template.nodes.frame.querySelectorAll(
                            f'a.nav-link[page="{previous}"]'
                        )
                        for link in links:
                            link.classList.remove("disabled")
                    links = owner.template.nodes.frame.querySelectorAll(
                        f'a.nav-link[page="{current}"]'
                    )
                    for link in links:
                        ##log("Disabling:", link, native=True)  ##
                        link.classList.add("disabled")

            class Location:
                @property
                def location(self):
                    return native.location

                @property
                def path(self):
                    return native.location.pathname

                @property
                def search(self):
                    return native.location.search

            Location = Location()

            class History:
                def __init__(self):
                    """."""
                    element = component.div(
                        slot="data", parent=app, **{"[history]": True}
                    )

                    element.append(
                        component.div(**({"[path]": native.location.pathname}))
                    )

                    self._ = dict(element=element,index=0)

                def print(self):
                    """."""
                    console.dir(native.location)

                def __call__(self, *args, **kwargs):
                    """."""
                    self.push(*args, **kwargs)

                @property
                def element(self):
                    return self._["element"]
                
                @property
                def index(self) -> int:
                    return self._["index"]

                @property
                def history(self):
                    return native.history
                
                @property
                def size(self) -> int:
                    return native.history.length

                def replace(self, path: str, *args, **kwargs):
                    """."""
                    if not path:
                        return
                    if not path.startswith("/"):
                        path = f"/{path}"
                    if path == native.location.pathname:
                        return
                    self.history.replaceState({}, "", f"{path}{native.location.search}")

                def push(self, path: str, *args, **kwargs):
                    """."""
                    if not path:
                        return
                    if not path.startswith("/"):
                        path = f"/{path}"
                    if path == native.location.pathname:
                        return
                    
                    self.history.pushState({"index": self.index}, "", f"{path}{native.location.search}")
                    self._['index'] += 1

                    log('state:', self.state(), native=True, trace='push')##

                    self.element.append(component.div(**({"[path]": path})))

                def state(self):
                    return self.history.state

            History = History()

            @effect(app.state, "currentPage")
            class router:
                """Controls nav links from currentPage."""

                def __call__(self, change, message):
                    """Imports and shows page."""
                    current = change.currentPage
                    ##log("router got current:", current)  ##
                    path = self.path(current)
                    ##log("router created path:", path)  ##
                    History(path)
                    use(f"@@/{current}/", test=meta.test)

                @staticmethod
                def path(current: str) -> str:
                    """Returns base-corrected path from current."""
                    if base:
                        return f"/{base}/{current}"
                    return f"/{current}"

            console.dir(native.location)  ##

            @window.on()
            class popstate:
                def __init__(self):
                    """."""
                    self._ = dict()


                def __call__(self, event):
                    log('own index:', self._.get('index'))##
                    state = History.state()
                    log('state:', state, native=True, trace='popstate')##
                    index = getattr(state, 'index', None)
                    log('index:', index)##
                    self._['index'] = index





                    parts = native.location.pathname[1:].split("/")
                    ##log("popstate created parts:", parts)  ##
                    if base:
                        page = "home" if len(parts) == 1 else parts[1]
                    else:
                        page = next(iter(parts), "home")
                    ##log("popstate sends page:", page)  ##
                    app.state.update(dict(currentPage=page))

            # Handle initial page and enforce single-part path
            if base:
                page = "home" if len(parts) == 1 else parts[1]
                if len(parts) > 2:
                    log("Replacing")  ##
                    History.replace(f"/{base}/{page}")
            else:
                page = next(iter(parts), "home")
                if len(parts) > 1:
                    log("Replacing")  ##
                    History.replace(page)

            app.state.update(dict(currentPage=page))

            anvil.open_form(self)

    return dict(frame=frame)
