"""
mixup/mixup.py
"""


def main(use, *args, **kwargs):

    use("@@/assets/")
    anvil, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
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
    app = use("@@/app/", test=meta.test)
    component = use("@@/component/")

    compose = use("@@/compose/", test=meta.test)
    mixup = use("@@/mixup/", test=meta.test)

    

    

    element = document.createElement("div")

    @compose(element)
    class foo:
        def __init__(self, target):
            self._ = dict(target=target)

        @property
        def foo(self):
            target = self._["target"]
            return target.getAttribute("foo")

        @foo.setter
        def foo(self, foo):
            target = self._["target"]
            target.setAttribute("foo", foo)

    element.foo.foo = "FOO"
    log("element.foo.foo:", element.foo.foo)  ##
    console.log(element)  ##

    @mixup(element)
    class MyClass:
        def __init__(self):
            self._ = dict(dong=42, stuff="STUFF")

        def stuff(self):
            return self._.get("stuff")

        @property
        def ding(self):
            return self._.get("ding")

        @ding.setter
        def ding(self, ding):
            self._["ding"] = ding

        @property
        def dong(self):
            return self._["dong"]

    log("element._:", element._)  ##
    log("element.stuff():", element.stuff())  ##
    log("element.stuff.__name__:", element.stuff.__name__)  ##
    log("element.ding:", element.ding)  ##
    element.ding = "DING"
    log("element.ding:", element.ding)  ##
    log("element.dong:", element.dong)  ##
