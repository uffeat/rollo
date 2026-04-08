def main(use, *args, **kwargs):

    Base = use("@@/mixins").Base
    Html = use("@@/mixins").Html
    Wrap = use("@@/mixins").Wrap
    upgrade = use("@@/mixins").upgrade
    component = use("@@/component/")
    meta = use.meta
    log = use.log
    app = use.app
    patch = use("@@/patch/")

    css = use("@/rollo/").css


    colorway = (
        css.root.bsBlue,
        css.root.bsGreen,
        css.root.bsPink,
        css.root.bsIndigo,
        css.root.bsTeal,
        css.root.bsOrange,
        css.root.bsYellow,
    )

    use.anvil.Plot.templates.default = "plotly_dark"

    import json

    class thing(Base, Html):

        def __init__(
            self,
            *args,
            **kwargs,
        ):
            Base.__init__(self)
            Html.__init__(self)

            self.node.classList.add("container", "pt-3")

            ##log("shadow:", self.shadow, native=True)  ##

            # XXX TODO Refator source/transpiler/processor for explicit scrapt extraction
            self.template(
                use(
                    "assets/thing/thing.jinja",
                    test=True,
                    data=dict(stuff=json.dumps(dict(stuff=True)), ding="ding"),
                )
            )

            plot = use.anvil.Plot()
            plot.config.update(displaylogo=False, responsive=False)
            plot.layout.update(colorway=colorway)
            data = [
                {
                    "name": "Wonderland",
                    "x": [2019, 2020, 2021, 2022, 2023],
                    "y": [510, 620, 687, 745, 881],
                }
            ]
            plot.data = [use.anvil.go.Bar(**series) for series in data]
            self.append(plot, slot="plot")

            self.node.append(component.h3(text="Small thing"))

        def __call__(self, *args, **kwargs):
            """."""
            use("assets/thing/thing.js", test=True)

    use.console.warn("Using injected thing package.")
    return dict(thing=thing)
