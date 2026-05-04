def main(use, *args, **kwargs):

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, initialize = mixins.Base, mixins.Html, mixins.On, mixins.initialize
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

    router = use("@@/router/", test=meta.test)
    user = use("@@/user/", test=meta.test)

    # Register frame component
    use("@/frame/")
    use("assets/frame/frame.css", test=meta.test)

    __file__ = "frame"

    # CSS classes
    LINK_LIGHT = "link-light"
    NAV_LINK = "nav-link"
    NAV_LINK_LIGHT = f"{NAV_LINK}.{LINK_LIGHT}"
    SELECTOR = ":is(a[path].nav-link)"

    class frame(Html, Base):

        def __init__(
            self, *args, base: str = "", parts: tuple = None, path: str = "", **kwargs
        ):
            owner = self
            initialize(self, Base, Html)
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

            # User modal control
            @tools.on(
                component.nav(
                    "nav.d-flex",
                    component.a(
                        NAV_LINK_LIGHT,
                        text="Log out",
                        _action=user.Logout,
                        **{"[user]": True},
                    ),
                    component.a(NAV_LINK_LIGHT, text="Log in", _action=user.Login),
                    component.a(NAV_LINK_LIGHT, text="Sign up", _action=user.Signup),
                    slot="top",
                    parent=self.template.nodes.frame,
                )
            )
            def click(event):
                event.preventDefault()
                if not hasattr(event.target, "_action"):
                    return
                ##log("user link clicked", trace=__file__)  ##
                event.target._action()

            # Router nav links
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
                router(path)

            anvil.open_form(self)
            # Activate router
            router.use(base=base)

    return dict(frame=frame)
