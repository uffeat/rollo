def main(use, *args, **kwargs):
    use("@@/assets/")
    anvil, app, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.app,
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
    component = use("@@/component/")
    RichText = anvil.RichText
    get_dom_node = anvil.get_dom_node
    

    def render(*args, **data) -> str:
        """Returns text rendered from data using jinja/mdx-style placeholders."""
        # XXX A single data item can only be used for a single placeholder target.
        # Keys that do not match a placeholder are ignored.
        content = next(iter(args), "")
        content = content.strip()
        is_html = content.startswith("<")
        if is_html:
            # Make sure that nothing is interpreted as placeholders
            content = content.replace("{", "{{").replace("}", "}}")
            # Make sure that intended placeholders are interpreted as such
            content = content.replace("{{{{", "{").replace("}}}}", "}")
        else:
            # Adapt placeholders
            content = content.replace("{{", "{").replace("}}", "}")
        # Interpolate
        rich = RichText(
            data=data,
            content=content,
            enable_slots=True,
            # HACK Render, even html, as text to circumvent restrictions
            # (internal use -> no safety concerns)
            format="plain_text",
        )
        # Extract text
        text = get_dom_node(rich).textContent
        if is_html:
            # Restore original bracket syntax (typically CSS)
            text = text.replace("{{", "{").replace("}}", "}")
        return text


    return dict(render=render)
