"""
plot/plot.py
"""


def main(use, *args, **kwargs):
    use("@@/assets/")  # For side effects
    use("@/frame/")  # For side effects

    rollo = use("@/rollo/")
    Sheet, css, element = rollo.Sheet, rollo.css, rollo.element
    component = use("@@/component/")
    js = use("@@/js/")
    mixins = use("@@/mixins")
    Base, Html, Page = mixins.Base, mixins.Html, mixins.Page
    log, meta = use.log, use.meta
    Plot = use("@@/plot/")

    sheet = Sheet.create().use()
    sheet.rules.add(
        {'div[anvil-slot="smallPlot"]': dict(border="2px solid pink", flexDirection='column', **css.display.flex)}
    )

    class MyPage(Base, Html):

        def __init__(
            self,
            *args,
            **kwargs,
        ):
            Base.__init__(self)
            Html.__init__(self)

            template = component.SECTION(
                component.H1(text="My page"),
                component.DIV(**{"[anvil-slot]": "plot"}),
                component.DIV(**{"[anvil-slot]": "smallPlot"}),
            ).outerHTML

            ##log("template:", template)##

            self.template(template)

            self.append(
                Plot(
                    slot="plot",
                    data=[
                        dict(
                            Scatter=dict(
                                name="Wonder Land",
                                x=[2019, 2020, 2021, 2022, 2023],
                                y=[510, 620, 687, 745, 881],
                            )
                        ),
                        js.object(
                            Bar=js.object(
                                name="Boogie Land",
                                x=[2019, 2020, 2021, 2022, 2023],
                                y=[310, 720, 287, 545, 781],
                            )
                        ),
                    ],
                ),
                Plot(
                    slot="plot",
                    data=[
                        dict(
                            Pie=dict(
                                labels=[
                                    "Oxygen",
                                    "Hydrogen",
                                    "Carbon Dioxide",
                                    "Nitrogen",
                                ],
                                values=[4500, 2500, 1053, 500],
                                hole=0.3,
                            )
                        ),
                    ],
                ),
                Plot(
                    slot="smallPlot",
                    data=[
                        dict(
                            Sunburst=dict(
                                labels=[
                                    "Eve",
                                    "Cain",
                                    "Seth",
                                    "Enos",
                                    "Noam",
                                    "Abel",
                                    "Awan",
                                    "Enoch",
                                    "Azura",
                                ],
                                parents=[
                                    "",
                                    "Eve",
                                    "Eve",
                                    "Seth",
                                    "Seth",
                                    "Eve",
                                    "Eve",
                                    "Awan",
                                    "Eve",
                                ],
                                values=[10, 14, 12, 10, 2, 6, 6, 4, 4],
                            )
                        ),
                    ],
                ),
            )

    class start(Base, Html):

        def __init__(
            self,
            *args,
            **kwargs,
        ):
            Base.__init__(self)
            Html.__init__(self)

            self.node.id = "main"

            template = use("assets/start/start.jinja", test=True)
            self.template(template)

    start = start()
    use.anvil.open_form(start)

    start.append(MyPage())
