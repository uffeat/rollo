def main(use, *args, **kwargs):

   

    Sheet = use("@/rollo/").Sheet
    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On = mixins.Base, mixins.Html, mixins.On
    console, document, log, meta = use.console, use.document, use.log, use.meta
    component = use("@@/component/")

    class about(Base, Html):

        page = True
        

        def assets() -> dict:
            return dict(
                sheets=[
                    use("assets/about/about.css.html", test=meta.test),
                ],
                template=use(f"assets/about/about.md", test=meta.test),
            )

        def __init__(self, **options):
            Base.__init__(self)
            Html.__init__(self)

            self.node.classList.add('container', 'mt-3')

    return dict(about=about)
