"""
packages/stay/stay.py
"""


def main(use, *args, **kwargs):
    

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

    use("@@/stay/", test=True)()
