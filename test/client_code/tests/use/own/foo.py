"""
use/own/foo.py
"""


def main(use, *args, **kwargs):
    """."""
    console = use.console
    document = use.document
    JSON = use("@@/js").JSON
    log = use.log
    meta = use.meta
    Promise = use("@@/promise").Promise
    source = use.source
    works = use.anvil
    js = use("@@/js/")

    _assets = use.assets
    Sheet = _assets.get("@/rollo/").Sheet

    @source()
    class assets:

        cache = {}

        def __call__(self, path, test=False, **options):
            """."""
            # Link-implemented stylesheet
            if path.type == "css":
                # Escape subsequent transpilation/processing
                path.detail.escape = True
                if options.get("raw"):
                    return self.get_text(path, test=test)

                # HACK
                if meta.DEV and test:
                    try:
                        style = document.head.querySelector(
                            f'style[path="{path.path}"]'
                        )
                        if style:
                            return style
                        text = works.server.call("_assets", path.path)
                        style = document.createElement("style")
                        style.textContent = text
                        style.setAttribute("path", path.path)
                        document.head.append(style)
                        return style
                    except Exception as error:
                        console.warn(f"Not using injected {path.path}. {str(error)}")

                # Add or get link
                href = f"/_/theme{path.path}"
                link = document.head.querySelector(f'link[href="{href}"]')
                if not link:
                    link = document.createElement("link")
                    link.rel, link.href = "stylesheet", href
                    promise = Promise()
                    link.addEventListener("load", lambda event: promise())
                    document.head.append(link)
                    promise.wait()
                return link

            if path.type == "html":

                # HACK Handle types that exploit Anvil's fast HTML import

                if path.types == "css.html":
                    # Ensure subsequent treatment as pure type
                    path.type = path.types = "css"
                    node = self.create_node(path, test=test)
                    selector = "style[sheet]"
                    style = node.querySelector(selector)
                    if not style:
                        raise ValueError(
                            f"No result from selector '{selector}' ({path.path})."
                        )
                    result = style.textContent.strip()
                    return result

                if path.types == "html.html":
                    # Ensure subsequent treatment as pure type
                    path.type = path.types = "html"
                    node = self.create_node(path, test=test)
                    result = node.innerHTML.strip()
                    if not result:
                        raise KeyError(f"Invalid asset: {path.path}.")
                    return result

                if path.types == "jinja.html":
                    # Ensure subsequent treatment as html
                    path.type = path.types = "html"
                    node = self.create_node(path, test=test)
                    result = node.innerHTML.strip()
                    if not result:
                        raise KeyError(f"Invalid asset: {path.path}.")
                    return self.render(result, **options.get("data", {}))

                if path.types == "js.html":
                    # Ensure subsequent treatment as pure type
                    path.type = path.types = "js"
                    selector = "template[module]"
                    node = self.create_node(path, test=test)
                    template = node.querySelector(selector)
                    if not template:
                        raise ValueError(
                            f"No result from selector '{selector}' ({path.path})."
                        )
                    script = template.content.querySelector("script")
                    if not script:
                        raise ValueError(f"No script in '{selector}' ({path.path}).")
                    text = script.textContent.strip()
                    return text

                if path.types == "svg.html":
                    # Ensure subsequent treatment as pure type
                    path.type = path.types = "svg"
                    node = self.create_node(path, test=test)
                    result = node.innerHTML.strip()
                    if not result:
                        raise KeyError(f"Invalid asset: {path.path}.")
                    return result

                # Default -> text
                return self.get_text(path, test=test)

            if path.type == "jinja":
                # Ensure subsequent treatment as html
                path.type = path.types = "html"
                text = self.get_text(path, test=test)
                return self.render(text, **options.get("data", {}))

            if path.type == "js":
                if options.get("raw"):
                    return self.get_text(path, test=test)
                if meta.DEV and test:
                    try:
                        return js.module(
                            works.server.call("_assets", path.path), path=path.path
                        )
                    except Exception as error:
                        console.warn(f"Not using injected {path.path}. {str(error)}")
                return works.js.import_from(f"/_/theme{path.path}")

            if path.type == "md":
                # Escape subsequent transpilation/processing
                path.detail.escape = True
                if path.path in self.cache:
                    return self.cache[path.path]
                content = self.get_text(path, test=test)
                rich = works.RichText(format="markdown", content=content)
                result = works.get_dom_node(rich).innerHTML
                self.cache[path.path] = result
                return result

            # Default -> text
            return self.get_text(path, test=test)

        @staticmethod
        def create_node(path, test=False):
            if meta.DEV and test:
                try:
                    html = works.server.call("_assets", path.path)
                    node = document.createElement("div")
                    node.innerHTML = html
                    return node
                except Exception as error:
                    console.warn(f"Not using injected {path.path}. {str(error)}")
            return works.js.get_dom_node(
                works.HtmlTemplate(html=f"@theme:{path.path[1:]}")
            )

        @staticmethod
        def render(text, **data):
            """."""
            content = text.replace("{{", "{").replace("}}", "}")
            rich = works.RichText(
                enable_slots=True, format="plain_text", content=content
            )
            rich.data = data
            result = works.get_dom_node(rich).textContent
            return result

        def get_text(self, path, cache=False, test=False):
            if meta.DEV and test:
                try:
                    return works.server.call("_assets", path.path)
                except Exception as error:
                    console.warn(f"Not using injected {path.path}. {str(error)}")
            if cache and path.path in self.cache:
                return self.cache[path.path]
            text = works.URLMedia(f"/_/theme{path.path}").get_bytes().decode("utf-8")
            if cache:
                self.cache[path.path] = text
            return text

    # ** Test
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

    
