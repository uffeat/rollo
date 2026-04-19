def main(use, *args, **kwargs):

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On = mixins.Base, mixins.Html, mixins.On
    console, document, log, meta = use.console, use.document, use.log, use.meta
    component = use("@@/component/")

    Iframe = use("assets/tools/iframe", test=meta.test).Iframe

    class front(Base):

        page = True

        def __init__(self, **options):
            Base.__init__(self)

            iframe = Iframe(dict(name="front", src=f"{meta.origin}/front"))

            ##log("iframe:", iframe, native=True)  ##
            self.node.classList.add('w-100')

            self.node.append(iframe)
            # Hand over to JS
            setup = use("assets/front/", test=meta.test).default
            setup(self.node)

    return dict(front=front)
