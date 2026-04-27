def main(use, *args, **kwargs):

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, Wrap = mixins.Base, mixins.Html, mixins.On, mixins.Wrap
    anvil, app, console, document, js, log, meta, native, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")
    Modal = use("@@/modal", test=meta.test).Modal

    
    class stuff(Base):
        """XXX For testing."""

        page = True

        def __init__(self, *args, caller: str = None, **kwargs):
            Base.__init__(self)

        def __call__(self, *args, **kwargs):
            modal = Modal()

            @modal.content()
            def content(close):
                content = component.div(component.p(".pe-3", text="Some content..."))
                ok = component.button(".btn.btn-primary", text="OK", _value=True)
                cancel = component.button(".btn.btn-secondary", text="Cancel", _value=None)
                footer = component.footer(
                    ".w-100.my-3.pe-2.d-flex.justify-content-end.gap-3",
                    ok,
                    cancel,
                    parent=content,
                )

                @footer.on()
                def click(event):
                    if not hasattr(event.target, "_value"):
                        return
                    close(event.target._value)

                return content

            result = modal(title="Stuff")
            return result


    return dict(stuff=stuff)
