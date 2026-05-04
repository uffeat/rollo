"""
index/index.py
"""


def main(use, *args, **kwargs):

    use("@@/assets/")
    anvil, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
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
    app = use("@@/app/", test=meta.test)
    component = use("@@/component/")

    # CSS classes
    NAV_LINK = "nav-link"
    

    frame = document.getElementById("frame")
    nav = frame.querySelector('nav[slot="side"]')
    nav.append(component.a(NAV_LINK, text="Index", **{"[path]": "/index"}))
    ##frame = frame_element.parent.host
    ##frame.clear()

    ##srcdoc = use(f"assets/index/index.html", raw=True, test=True)
    ##log("srcdoc:", srcdoc)

    ##iframe = component.iframe(srcdoc=srcdoc)
    ##frame_element.append(iframe)


