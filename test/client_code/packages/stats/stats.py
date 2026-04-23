def main(use, *args, **kwargs):

    use("@@/assets/")
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

    Plot = use("@@/plot/", test=meta.test)

    class stats(Html, Base):

        page = True

        def assets() -> dict:
            return dict(
                template=use("assets/stats/stats.html", test=meta.test),
            )

        def __init__(self, **options):
            Base.__init__(self)
            Html.__init__(self)
            self.node.classList.add("container", "mt-3")

            traces = [
                dict(
                    Scatter=dict(
                        name="Wonder Land",
                        x=[2019, 2020, 2021, 2022, 2023],
                        y=[510, 620, 687, 745, 881],
                    )
                )
            ]

            plot = Plot(*traces)

            self.append(plot)

    return dict(stats=stats)
