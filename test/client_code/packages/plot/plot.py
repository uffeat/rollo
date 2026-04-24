def main(use, *args, **kwargs):

    use("@@/assets/")  # For side effects
    mixins = use("@@/mixins")
    Base, Html, On, Wrap = mixins.Base, mixins.Html, mixins.On, mixins.Wrap
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

        def __init__(self, *args, data: list=None, **kwargs):
            Base.__init__(self)
            self._.update(plot=use.anvil.Plot())
            self.plot.config.update(Config())
            self.plot.layout.update(Layout())
            self.append(self.plot)

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
