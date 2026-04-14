def main(use, *args, **kwargs):

    ##bootstrap = use("@/bootstrap/")

    rollo = use("@/rollo/")
    Sheet = rollo.Sheet

    use("@@/assets/")
    mixins = use("@@/mixins")
    Base, Html, On = mixins.Base, mixins.Html, mixins.On
    console, document, log, meta = use.console, use.document, use.log, use.meta
    component = use("@@/component/")

    ##
    ##
    response: dict = use.anvil.server.call(
        "main", "echo", data=dict(args=["ECHO"]), query=dict(submission=42)
    )
    if "__error__" in response:
        message = response["__error__"]
        print("meta:", response.get("meta"))
        raise ValueError(f"Error: {message}")
    log("Result:", response.get("result"))
    ##
    ##

    setup = use("assets/about/", test=True).default

    class about(Base, On, Html):

        page = True

        def assets() -> dict:
            return dict(
                sheets=[
                    use("assets/about/about.css.html", test=True),
                ],
                template=use(f"assets/about/about.md?test"),
            )

        def __init__(self, *args, **kwargs):
            Base.__init__(self)
            Html.__init__(self)
            On.__init__(self)

            setup(self.node)

    return dict(about=about)
