def main(use, *args, **kwargs):

    use("@@/assets/")  # For side effects
    mixins = use("@@/mixins")
    Base, Html, On, Wrap, initialize = (
        mixins.Base,
        mixins.Html,
        mixins.On,
        mixins.Wrap,
        mixins.initialize,
    )
    anvil, app, console, document, js, log, meta, native, tools, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.tools,
        use.window,
    )
    component = use("@@/component/")

    use("assets/plot/plot.css")

    def Config() -> dict:
        # NOTE The plot is responsive (due to styling or some Anvil tricks), so turn
        # off Plotly's responsiveness for perf reasons.
        return dict(displaylogo=False, responsive=False)

    def Layout() -> dict:
        css = use("@/rollo/").css
        return dict(
            colorway=(
                css.root.bsBlue,
                css.root.bsGreen,
                css.root.bsPink,
                css.root.bsIndigo,
                css.root.bsTeal,
                css.root.bsOrange,
                css.root.bsYellow,
            ),
            font=dict(color=css.root.bsLight),
        )

    class plot(Base):

        def __init__(self, *args, data: list = None, path: str = None, **kwargs):
            initialize(self, Base)
            self._.update(plot=use.anvil.Plot())
            self.plot.config.update(Config())
            self.plot.layout.update(Layout())
            self.append(self.plot)

            ##log("data:", data)  ##

            if path and use.meta.IWORKER:
                # NOTE Invoked from server and embedded. Assume CORS.

                @tools.on(use.app)
                def _resize_y(event):
                    window.parent.postMessage(
                        dict(height=event.detail, type="height"), "*"
                    )

                # Test height sync
                form = component.form(
                    "p-3", component.input("form-control"), parent=self.node
                )
                form.on("submit")(lambda event: event.preventDefault())

                @form.on()
                def change(event):
                    self.plot.height = f"{event.srcElement.value}px"

            if data:
                self(*data)

        def __call__(self, *data, **kwargs):
            """Renders plot from traces that can consist of JS objects and/or Py dicts."""
            self.plot.data = [
                getattr(use.anvil.go, k)(**v)
                for t in data
                for k, v in [next(iter(dict(t).items()))]
            ]
            return self

        @property
        def plot(self):
            """Returns plot component."""
            return self._["plot"]

    return dict(plot=plot)
