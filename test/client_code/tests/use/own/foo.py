"""
use/own/foo.py
"""


def main(use, *args, **kwargs):
    """."""
    import json

    assets = use.assets
    component_from = use("@/rollo/").htmlToComponent
    document = use.document
    JSON = use("@@/js").JSON
    log = use.log
    meta = use.meta
    Promise = use("@@/promise").Promise
    source = use.source
    works = use.anvil

    @source()
    class Assets:

        cache = {}

        def __call__(self, path, test=False, **options):
            """."""
            # Link-implemented stylesheet
            if path.type == "css":
                # Escape subsequent transpilation/processing
                path.detail.escape = True
                if options.get("raw"):
                    return self.get_text(path)
                # Add or get link
                href = f"{meta.origin}/_/theme{path.path}"
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
                    node = self.create_node(path)
                    style = node.querySelector("style[sheet]")
                    text = style.textContent.strip()
                    return text

                if path.types == "html.html":
                    # Ensure subsequent treatment as pure type
                    path.type = path.types = "html"
                    node = self.create_node(path)
                    return node.innerHTML.strip()

                if path.types == "js.html":
                    # Ensure subsequent treatment as pure type
                    path.type = path.types = "js"
                    node = self.create_node(path)
                    template = node.querySelector("template[module]")
                    script = template.content.querySelector("script")
                    text = script.textContent.strip()
                    return text

                if path.types == "svg.html":
                    # Ensure subsequent treatment as pure type
                    path.type = path.types = "svg"
                    node = self.create_node(path)
                    return node.innerHTML.strip()

                ##
                ##
                if path.types == "txt.html":
                    # Escape subsequent transpilation/processing
                    path.detail.escape = True
                    node = self.create_node(path)
                    pre = node.querySelector("pre")
                    text = pre.textContent.strip()
                    return text
                ##
                ##

                # Default -> text
                return self.get_text(path)

            
            if path.type == "jinja":
                path.type = path.types = "html"
                text = self.get_text(path)
                content = text.replace('{{', '{').replace('}}', '}')
                rich = works.RichText(enable_slots=True, format="plain_text", content=content)
                rich.data = options.get('data', {})
                result = works.get_dom_node(rich).textContent
                return result
            
            
            if path.type == "js":
                if options.get("raw"):
                    return self.get_text(path)
                return works.js.import_from(f"/_/theme{path.path}")

            if path.type == "md":
                # Escape subsequent transpilation/processing
                path.detail.escape = True
                if path.path in self.cache:
                    return self.cache[path.path]
                content = self.get_text(path)
                rich = works.RichText(format="markdown", content=content)
                result = works.get_dom_node(rich).innerHTML
                self.cache[path.path] = result
                return result

            # Default -> text
            return self.get_text(path)

        @staticmethod
        def create_node(path):
            node = works.js.get_dom_node(
                works.HtmlTemplate(html=f"@theme:{path.path[1:]}")
            )
            return node

        @staticmethod
        def get_text(path):
            text = (
                works.URLMedia(f"{meta.origin}/_/theme{path.path}")
                .get_bytes()
                .decode("utf-8")
            )
            return text

    # Native pure type imports
    log("link:", use("assets/tests/foo.css"), native=True)  ##
    log("foo.css:", use("assets/tests/foo.css"), native=True)  # Repeat to check dedupe
    log("foo.css raw:", use("assets/tests/foo.css", raw=True), native=True)
    log("foo.js:", use("assets/tests/foo.js"), native=True)  ##
    log("foo.js raw:", use("assets/tests/foo.js", raw=True), native=True)  ##
    log("foo.json:", use("assets/tests/foo.json"), native=True)  ##
    log("foo.json raw:", use("assets/tests/foo.json", raw=True), native=True)  ##
    log("foo.json py:", json.loads(use("assets/tests/foo.json", raw=True)))  ##

    # Import of composite html types
    log("foo.css.html:", use("assets/tests/foo.css.html"), native=True)  ##
    log("foo.html.html:", use("assets/tests/foo.html.html"), native=True)  ##
    log("foo.js.html:", use("assets/tests/foo.js.html"), native=True)  ##
    log("foo.svg.html:", use("assets/tests/foo.svg.html"), native=True)  ##

    ##
    log("foo.txt.html:", use("assets/tests/foo.txt.html"), native=True)  ##
    ##

    # Markdown import
    log("foo.md:", use("assets/tests/foo.md"), native=True)  ##

    # Component import from html
    log(
        "component:",
        use("assets/tests/foo.html", convert=True),
        native=True,
    )  ##

    # Lab
    def render(path, **data):
        content = use(f"assets/{path}").replace('{{', '{').replace('}}', '}')
        rich = works.RichText(enable_slots=True, format="plain_text", content=content)
        rich.data = data
        result = works.get_dom_node(rich).textContent
        return result
    
    print("rendered:", render('tests/foo.jinja', year=1969, stuff=42))
    




    text = use("assets/tests/foo.jinja")
    text = text.replace('{{', '{').replace('}}', '}')
    rich = works.RichText(enable_slots=True, format="plain_text", content=text)
    rich.data = dict(year=1969)
    result = works.get_dom_node(rich).textContent
    print("result:", result)

    print("component:", component_from('<h1>Hi</h1>'))


    log("foo.jinja:", use("assets/tests/foo.jinja", data=dict(year=1969)), native=True)  ##
    log("foo.jinja converted:", use("assets/tests/foo.jinja", data=dict(year=1969), convert=True), native=True)  ##
