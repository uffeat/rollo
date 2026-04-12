def main(use, *args, **kwargs):

    bootstrap = use("@/bootstrap/")

    rollo = use("@/rollo/")
    Sheet = rollo.Sheet

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On, Page = mixins.Base, mixins.Html, mixins.On, mixins.Page
    log, meta = use.log, use.meta
    component = use("@@/component/")

    sheet = use("assets/about/about.css.html", test=True)

    class about(Base, On, Page, Html):

        assets = dict(template=use("assets/about/about.md", test=True))



        def __init__(self, *args, **kwargs):
            Base.__init__(self)
            Html.__init__(self)
            On.__init__(self)
            Page.__init__(self)

            ##assets = getattr(self.__class__, 'assets', {})
            ##self.template(assets.get('template'))

            

            
            template = use("assets/about/about.md", test=True)
            self.template(template)

            self.node.append(
                component.div(
                    "alert alert-danger alert-dismissible",
                    component.div(text="Injected"),
                    component.button(
                        "btn-close",
                        type="button",
                        ariaLabel="Close",
                        **{"[data-bs-dismiss]": "alert"}
                    ),
                    role="alert",
                ),
            )

        def on_connect(self):
            sheet.use()

        def on_disconnect(self):
            sheet.unuse()

    use.console.warn("Using injected about package")

    return dict(about=about)
