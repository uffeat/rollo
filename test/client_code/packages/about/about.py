def main(use, *args, **kwargs):
    Sheet = use("@/rollo/").Sheet
    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On = mixins.Base, mixins.Html, mixins.On
    anvil, console, document, js, log, meta, native, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")

    class about(Html, Base):

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
            self.node.append(component.h3(text='Some sub-title...'))

            log('mro:', self.meta.chain())

            
            mro = self.__class__.mro()
           
            if mro.index(Base) > mro.index(Html):
                ValueError('Wrong mro')
            

            

           

            





            

    

    return dict(about=about)
