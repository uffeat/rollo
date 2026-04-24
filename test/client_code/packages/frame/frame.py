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
    Login, Logout, Signup, get_user = user.Login, user.Logout, user.Signup, user.get_user
    effect = use("@@/state").effect



    # Register frame component
    use("@/frame/")
    use("assets/frame/frame.css", test=meta.test)

    class frame(Html, Base, On):

        def __init__(self, *args, server_data: dict=None, **kwargs):
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

            """Set up router.
            NOTE Using app state for routing enables:
            - Attribute-based page-specific styling; e.g., page="about" -> state-current-page="about" 
            attr on app.
            - Accessible from JS (without module import).
            XXX Use 'currentPage' key (rather than 'page') to avoid collision with CSS prop.
            """

            log('server_data:', server_data)

            def decode_path(path: str) -> str:
                """."""
                return path[len("/test/") :]
            
            def encode_path(path: str) -> str:
                """."""
                return f"/test/{path}"

            @effect(app.state, "currentPage")
            def route(change, message):
                """Imports and shows page."""
                current = change.currentPage
                path = encode_path(current)
                ##log("pathname:", native.location.pathname)  ##
                if path != native.location.pathname:
                    ##log("Pusing path:", path)  ##
                    native.history.pushState({}, "", path)  ##

                use(f"@@/{current}/", test=meta.test)

            @window.on(run=True)
            def popstate(event):
                ##log("pathname:", native.location.pathname)  ##
                currentPage = decode_path(native.location.pathname)
                ##log("currentPage:", currentPage)  ##
                app.state.update(dict(currentPage=currentPage))

            # Nav links -> updates currentPage state
            ACTIVE = "disabled"
            NAV_LINK = 'nav-link'
            SELECTOR = ":is(a[page].nav-link)"

            @tools.on(
                self.template.nodes.home,
                component.nav(
                    "nav.d-flex.flex-column",
                    component.a("nav-link", text="About", **{"[page]": "about"}),
                    component.a("nav-link", text="Front", **{"[page]": "front"}),
                    component.a("nav-link", text="Stats", **{"[page]": "stats"}),
                    component.a("nav-link", text="No path"),
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
                previous = self.node.querySelector(f"{SELECTOR}.{ACTIVE}")
                if previous:
                    previous.classList.remove(ACTIVE)
                target.classList.add(ACTIVE)
                page = target.getAttribute("page")
                app.state.update(dict(currentPage=page))

            # Set up user state

            nav = component.nav(
                "nav.d-flex",
                component.a(
                    "nav-link.link-light", text="Log out", _action=Logout
                ),
                component.a(
                    "nav-link.link-light", text="Log in", _action=Login
                ),
                component.a(
                    "nav-link.link-light", text="Sign up", _action=Signup
                ),
                slot="top",
                parent=self.template.nodes.frame,
            )

            @nav.on()
            def click(event):
                event.preventDefault()
                if not hasattr(event.target, '_action'):
                    return
                event.target._action()


            anvil.open_form(self)
            
                

    

    return dict(frame=frame)
