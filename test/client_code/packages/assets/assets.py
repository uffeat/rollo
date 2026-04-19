def main(use, *args, **kwargs):

    Sheet = use("@/rollo/").Sheet
    console, document, js, log, meta, works = (
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.works,
    )
    component = use("@@/component/")

    def create_node(path):
        """Returns html element with inner html from path."""
        node = works.js.get_dom_node(works.HtmlTemplate(html=f"@theme:{path.path[1:]}"))
        return node

    @use.source()
    class assets:

        def __init__(self, **options):
            """."""

        def __call__(self, path, test=meta.test, **options):
            """."""
            if path.types == "html":
                node = create_node(path, test=test)
                result = node.innerHTML.strip()
                if not result:
                    raise KeyError(f"Invalid asset: {path.path}.")
                return result

            if path.types == "css.html":
                path.type = path.types = "css"
                node = create_node(path, test=test)

    return dict(assets=assets)
