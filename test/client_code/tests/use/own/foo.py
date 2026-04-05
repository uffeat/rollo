"""
use/own/foo.py
"""



def main(use, *args, **kwargs):
    """."""
    import json

    _assets = use.assets
    document = use.document
    JSON = use("@@/js").JSON
    log = use.log
    meta = use.meta
    Promise = use("@@/promise").Promise
    source = use.source
    works = use.anvil

    @source()
    class assets:

        cache = {}

        def __call__(self, path, test=False, **options):
            """."""
            if path.type == "css":
                path.detail.escape = True
                href = f"{meta.origin}/_/theme{path.path}"
                link = document.head.querySelector(f'link[href="{href}"]')
                if not link:
                    link = document.createElement("link")
                    link.rel = "stylesheet"
                    link.href = href
                    promise = Promise()
                    link.addEventListener("load", lambda event: promise())
                    document.head.append(link)
                    promise.wait()
                return link

            if path.type == "html":
                node = self.create_node(path.path[1:])

                if path.types == "html":
                    return node.innerHTML.strip()

                if path.types == "css.html":
                    path.type = "css"
                    node = self.create_node(f"{path.path[1:]}")
                    style = node.querySelector("style")
                    text = style.textContent.strip()
                    return text

                if path.types == "js.html":
                    path.type = "js"
                    if path.path in self.cache:
                        return self.cache[path.path]
                    node = self.create_node(f"{path.path[1:]}")
                    template = node.querySelector("template")
                    script = template.content.querySelector("script")
                    text = script.textContent.strip()
                    result = _assets.module(text, path.path)
                    self.cache[path.path] = result
                    return result
                
                if path.types == "json.html":
                    path.type = "json"
                    if path.path in self.cache:
                        return self.cache[path.path]
                    node = self.create_node(f"{path.path[1:]}")
                    template = node.querySelector("template")
                    script = template.content.querySelector("script")
                    text = script.textContent.strip()
                    mod = _assets.module(text, path.path)
                    result = JSON.stringify(mod.default)
                    self.cache[path.path] = result
                    return result

                if path.types == "x.html":
                    """XXX TODO"""

            if path.type == "js":
                return works.js.import_from(f"/_/theme{path.path}")

            if path.type == "md":
                path.detail.escape = True
                if path.path in self.cache:
                    return self.cache[path.path]
                text = (
                    works.URLMedia(f"{meta.origin}/_/theme{path.path}")
                    .get_bytes()
                    .decode("utf-8")
                )
                rich = works.RichText(format="markdown", content=text)
                result = works.get_dom_node(rich).innerHTML
                self.cache[path.path] = result
                return result

            raise TypeError(f"Unsupported asset: {path.path}")

        @staticmethod
        def create_node(path: str):
            node = works.js.get_dom_node(works.HtmlTemplate(html=f"@theme:{path}"))
            return node

    log("foo.js:", use("assets/tests/foo.js"), native=True)  ##
    log("foo.js.html:", use("assets/tests/foo.js.html"), native=True)  ##
    log("foo.json.html:", use("assets/tests/foo.json.html"), native=True)  ##
    log("Raw json:", use("assets/tests/foo.json.html", raw=True), native=True)  ##
    log("sheet:", use("assets/tests/foo.css.html"), native=True)  ##
    log("link:", use("assets/tests/foo.css"), native=True)  ##
    log("From md:", use("assets/tests/foo.md"), native=True)  ##

    log(
        "component:",
        use("assets/tests/foo.html", convert=True),
        native=True,
    )  ##
    ##log("x:", use("assets/tests/foo.x.html"), native=True)  ##
