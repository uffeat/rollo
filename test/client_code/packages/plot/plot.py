def main(use, *args, **kwargs):

    use("@@/assets/")  # For side effects
    mixins = use("@@/mixins")
    Base, Html, On, Page = mixins.Base, mixins.Html, mixins.On, mixins.Page
    log, meta = use.log, use.meta
    component = use("@@/component/")
    js = use("@@/js/")
    Promise = use("@@/promise").Promise

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

    class Plot(Base, Page):

        def __init__(self, *args, **kwargs):
            Base.__init__(self)

            args = js.signature(args, kwargs)
            self.slot = kwargs.get("slot")

            plot = use.anvil.Plot()
            plot.config.update(Config())
            plot.layout.update(Layout())
            self.append(plot)
            self._.update(plot=plot)

        def __call__(self, *traces, **kwargs):
            """Renders plot from traces that can consist of JS objects and/or Py dicts."""
            self.plot.data = [
                getattr(use.anvil.go, k)(**v)
                for t in traces
                for k, v in [next(iter(dict(t).items()))]
            ]

        @property
        def plot(self):
            """Returns plot component."""
            return self._["plot"]

    class plot(Plot, Page):
        """Page version of Plot."""

        def __init__(self, *args, **kwargs):
            Plot.__init__(self, *args, **kwargs)
            Page.__init__(self)

    use.console.warn("Using injected plot package.")
    return dict(Plot=Plot, plot=plot)
