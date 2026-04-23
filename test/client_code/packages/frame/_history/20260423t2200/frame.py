def main(use, *args, **kwargs):

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, initialize = mixins.Base, mixins.Html, mixins.On, mixins.initialize
    anvil, app, console, document, js, log, meta, native, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")

    Alpine = use("assets/alpine/").Alpine

    # Register frame component
    use("@/frame/")
    use("assets/frame/frame.css", test=meta.test)

   


    class frame(Html, Base, On):

        def __init__(self, *args, **kwargs):
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

        

    frame = frame()

    """Set up router.
    NOTE Using app state for routing enables:
    - Attribute-based page-specific styling; e.g., page="about" -> state-current-page="about" 
      attr on app.
    - Accessible from JS (without module import).
    XXX Use 'currentPage' key (rather than 'page') to avoid collision with CSS prop.
    """

    ##base = native.location.pathname
    ##log("base:", base)  ##

    def effect(change, message):
        """Imports and shows page."""
        ##console.log("message from effect:", message)  ##
        current = change.currentPage
        ##previous = message.owner.previous.currentPage
        ##data = message.detail.data
        ##data.ding = "DING"
        console.warn("current page from effect:", current)  ##
        ##console.log("previous page from effect:", previous)  ##
        ##console.log("data from effect:", data)  ##
        ##console.log("detail from effect:", message.owner.detail)  ##
        url = f"/test/{current}"
        log("Pusing url:", url)  ##
        native.history.pushState({}, "", url)  ##
        use(f"@@/{current}/", test=meta.test)

    app.effects.add(effect, ["currentPage"], dict(data=dict(baz=7)))

    @window.on(run=True)
    def popstate(event):
        log("event:", event, native=True)  ##
        pathname = native.location.pathname
        log("pathname:", pathname)  ##
        currentPage = pathname[len("/test/") :]  ##
        ##log("currentPage:", currentPage)  ##
        app.state.update(dict(currentPage=currentPage))

    # Build side nav
    nav = component.nav(
        "nav.d-flex.flex-column",
        component.a("nav-link", text="About", **{"[page]": "about"}),
        component.a("nav-link", text="Front", **{"[page]": "front"}),
        component.a("nav-link", text="Stats", **{"[page]": "stats"}),
        component.a("nav-link", text="No path"),
        slot="side",
        parent=frame.template.nodes.frame,
    )

    # Nav links -> updates currentPage state
    @frame.on(frame.template.nodes.home, nav)
    class click:
        ACTIVE = "disabled"
        SELECTOR = ":is(a[page].nav-link)"

        def __call__(self, event):
            event.preventDefault()
            target = (
                event.target
                if event.target.matches(self.SELECTOR)
                else event.target.closest(self.SELECTOR)
            )
            if not target:
                return
            previous = frame.node.querySelector(f"{self.SELECTOR}.{self.ACTIVE}")
            if previous:
                previous.classList.remove(self.ACTIVE)
            target.classList.add(self.ACTIVE)
            page = target.getAttribute("page")
            app.state.update(dict(currentPage=page))

    return dict(frame=frame)
