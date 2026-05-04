def main(use, *args, **kwargs):
    use("@@/assets/")
    anvil, console, document, js, log, meta, native, tools, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.tools,
        use.window,
    )
    app = use("@@/app/")
    component = use("@@/component/")
    RichText = anvil.RichText
    get_dom_node = anvil.get_dom_node
    render = use("@@/render", test=meta.test)
    

    def markup(*args, tags=True, **data) -> str:
        """Returns html from markdown, optionally rendered from data."""
        content = next(iter(args), "")
        # XXX 'data' should not contain the keys: "tags"
        if data:
            content = render(content, **data)
        rich = RichText(content=content, enable_slots=False, format="markdown")
        html = get_dom_node(rich).innerHTML
        html = html.strip()
        if tags:
            # HACK Enable use of HTML
            temp = document.createElement("textarea")
            temp.innerHTML = html
            html = temp.value
            html = html.replace("<p><", "<").replace("></p>", ">")
        return html


    return dict(markup=markup)
