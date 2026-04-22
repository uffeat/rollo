def main(use, *args, **kwargs):
    Sheet = use("@/rollo/").Sheet
    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On = mixins.Base, mixins.Html, mixins.On
    anvil, console, document, js, log, meta, native, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")

    # Register frame component
    use("@/frame/")
    use("assets/frame/frame.css", test=meta.test)

    class frame(Html, Base):

        def __init__(self, **options):
            Base.__init__(self)
            Html.__init__(self)
            self.node.id = "main"
            # Set template
            self.template(use("assets/frame/frame.html", test=meta.test))

            # Add import engine processor for component packages
            @use.processor(f"component.py")
            def handler(
                cls,
                *args,
                owner=None,
                path=None,
                **options,
            ):
                def process(*args, **kwargs):
                    if path.detail.page:
                        # NOTE CSS ensures that persist slot is hidden when default slot is not empty
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
                                    cls(**options)
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
                                cls(**options) if "__init__" in cls.__dict__ else cls()
                            )
                            self.append(child)
                        result = (
                            child(*js.pythonize(args), **js.pythonize(kwargs))
                            if callable(child)
                            else None
                        )
                        return result
                    else:
                        return cls

                return process

    frame = frame()

    nav = component.nav(
        "nav.d-flex.flex-column",
        component.a("nav-link", text="About", _path="/path"),
        component.a("nav-link", text="Front", _path="/front"),
        component.a(
            "nav-link",
            text="Plot",
            _path="/plot",
            _data=[
                dict(
                    Scatter=dict(
                        name="Wonder Land",
                        x=[2019, 2020, 2021, 2022, 2023],
                        y=[510, 620, 687, 745, 881],
                    )
                )
            ],
        ),
        component.a("nav-link", text="No path"),
        slot="side",
        parent=frame.template.nodes.frame,
    )

    @nav.on()
    def click(event):
        event.preventDefault()
        if not hasattr(event.target, '_path'):
            return
        log("path:", event.target._path)##
        previous = nav.querySelector('.disabled')
        if previous:
            previous['class'].disabled = False
        event.target['class'].disabled = True


    return dict(frame=frame)
