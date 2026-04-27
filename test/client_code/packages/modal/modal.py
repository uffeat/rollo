def main(use, *args, **kwargs):

    
    
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
    
    
    

    

    
    use("assets/modal/modal.html.css").use()


    class Modal:
        def __init__(self):
            """."""
            owner = self

            host = anvil.HtmlTemplate()
            node = anvil.get_dom_node(host)
            node.setAttribute("modal", "")

            class _content:
                def __init__(self):
                    ...

                def __call__(self, target):
                    owner._["content"] = target
                    return target

            self._ = dict(_content=_content, host=host, node=node)

        def __call__(self, *args, buttons=None, dismissible=True, title=None):
            """Show modal and returns modal result."""
            # Handle content
            content = self._.get("content")
            if args:
                content = args[0]
            if callable(content):
                content = content(self.close)
            if content:
                self.node.append(content)

            # Allow closing by dispatching '_close' event to node
            def on_close(event):
                value = getattr(event, "detail", None)
                self.close(value=value)

            self.node.addEventListener("_close", on_close)

            result = anvil.anvil.alert(
                self.host, buttons=buttons, dismissible=dismissible, title=title
            )

            self.node.removeEventListener("_close", on_close)
            return result

        @property
        def content(self):
            """Decorates content function."""
            return self._["_content"]

        @property
        def host(self):
            return self._["host"]

        @property
        def node(self):
            return self._["node"]

        def close(self, value=None):
            self.host.raise_event("x-close-alert", value=value)
            return value


    def modal(*args, **kwargs):
        """."""
        return Modal()(*args, **kwargs)

    

    return dict(Modal=Modal, modal=modal)
