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
    render = tools.render
    component = use("@@/component/")
    bootstrap = use("@/bootstrap/").bootstrap
    Toast = bootstrap.Toast

    class toast:
        def __init__(self):
            self._ = dict()

        def __call__(self, title: str, content: str, delay: int = 5000, style: str='primary'):
            element = component.div(
                "toast",
                role="alert",
                ariaLive="assertive",
                ariaAtomic="true",
                parent=self.container,
            )
            html = render(self.template, title=title, content=content, style=style)
            element.html(html)
            toast = js.new(Toast)(element, delay=delay)

            @element.on("hidden.bs.toast", once=True)
            def onhidden(event):
                """Cleans up."""
                ##log("Disposing")  ##
                event.stopPropagation()
                toast.dispose()
                element.remove()

            toast.show()

        @property
        def container(self):
            if not self._.get("container"):
                container = component.div(
                    "position-fixed.bottom-0.end-0.p-3.d-flex.flex-column.row-gap-3.z-3",
                    parent=app,
                )
                self._.update(container=container)
            return self._["container"]

        @property
        def template(self):
            if not self._.get("template"):
                template = use("assets/toast/toast.html", test=meta.test)
                self._.update(template=template)
            return self._["template"]

    toast = toast()

    return dict(toast=toast)
