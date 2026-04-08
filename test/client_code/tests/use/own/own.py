"""
use/own/own.py
"""


def main(use, *args, **kwargs):
    """."""
    document = use.document
    log = use.log
    
    
    import json

    from_html = use("@@/component").from_html
    FOO = "assets/tests/foo"

    # Native pure type imports
    log("Link:", use(f"{FOO}.css", test=True), native=True)
    log("Link:", use(f"{FOO}.css", test=True), native=True)  # Repeat to check dedupe
    log("Raw css:", use(f"{FOO}.css", raw=True, test=True), native=True)
    log("foo member:", use(f"{FOO}.js", test=True).foo, native=True)
    log("Raw module:", use(f"{FOO}.js", raw=True, test=True), native=True)
    log("From json:", use(f"{FOO}.json", test=True), native=True)
    log("Raw json:", use(f"{FOO}.json", raw=True, test=True), native=True)
    log("From json, py:", json.loads(use(f"{FOO}.json", raw=True, test=True)))

    # Import of composite html types
    log("Sheet:", use(f"{FOO}.css.html", test=True), native=True)
    log("Markup:", use(f"{FOO}.html.html", test=True), native=True)
    log("Module:", use(f"{FOO}.js.html", test=True), native=True)
    log("Icon:", use(f"{FOO}.svg.html", test=True), native=True)

    # Markdown import
    log("From markdown:", use(f"{FOO}.md", test=True), native=True)

    # Component import from html
    log(
        "component:",
        use(f"{FOO}.html", convert=True),
        native=True,
    )

    # Render from jinja import
    log(
        "Rendered:",
        use(f"{FOO}.jinja.html", data=dict(year=1969), test=True),
        native=True,
    )
    log(
        "Rendered and converted:",
        use(f"{FOO}.jinja", data=dict(year=1969), convert=True, test=True),
        native=True,
    )
    log(
        "Rendered and wrapped:",
        from_html(
            "section.foo.bar", use(f"{FOO}.jinja", data=dict(year=1969), test=True)
        ),
        native=True,
    )
