"""
packages/plot/plot.py
"""


def main(use, *args, **kwargs):
    """Tests echo package."""

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

    use("@@/plot/", test=True)(
        dict(
            Scatter=dict(
                name="Wonder Land",
                x=[2019, 2020, 2021, 2022, 2023],
                y=[510, 620, 687, 745, 881],
            )
        )
    )
