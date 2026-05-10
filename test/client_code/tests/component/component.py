"""
component/component.py
"""


def main(use, *args, **kwargs):

    use("@@/assets/")
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
    ##app = use("@@/app/", test=meta.test)
    compose = use("@@/compose/", test=meta.test)
    mixup = use("@@/mixup/", test=meta.test)
    patch = use("@@/patch/", test=meta.test)
    # BUG Test version of 'Reactive' does not work!
    Reactive = use("@@/reactive").Reactive
    State = use("@@/state", test=meta.test).State

    component = use("@@/component/", test=meta.test)
    frame = document.getElementById("frame")
    parent = frame.querySelector('main[anvil-slot="default"]')

    h1 = component.h1(text="New component")

    reactive = Reactive(h1.state)

    @reactive.effect()
    def _effect(*args, **change):
        log("change:", change, trace="test", native=True)  ##

    ##log("h1:", h1, trace="test", native=True)  ##
    @h1.on()
    def click(event):
        log("Clicked")

    @compose(h1)
    class foo:
        def __init__(self):
            self._ = dict()

        def __call__(self, message, stuff=True):
            log("foo stuff:", stuff)
            log("foo message:", message)

        @property
        def foo(self):
            log("foo getter")
            return self._.get("foo")

        @foo.setter
        def foo(self, foo):
            log("foo setter")
            self._["foo"] = foo

    @mixup(h1)
    class Pow:
        def __init__(self):
            self._ = dict(pow='POW')

        def __call__(self, message):
            log("pow message:", message)

        @property
        def pow(self):
            log("pow getter")
            return self._.get("pow")

        @pow.setter
        def pow(self, pow):
            log("pow setter")
            self._["pow"] = pow


    log("h1.foo.foo:", h1.foo.foo)
    log("h1.foo('Hi from foo!'):", h1.foo("Hi from foo!"))

    log("h1.pow:", h1.pow)
    h1.pow = 42
    log("h1.pow:", h1.pow)

    @compose(h1)
    def ding(message):
        log("ding message:", message)

    h1.ding("Hi from ding!")

   

    h1.parent = parent
    reactive(boom=42)

    compose(h1, 'numbers')([1, 2, 3])
    log("h1.numbers:", h1.numbers)

    
    @property
    def dong(h1):
        log("dong getter")
        return getattr(h1, '_dong', None)
    
    @compose(h1)
    @dong.setter
    def dong(h1, dong):
        log("dong setter")
        h1._dong = dong


    


    

    
    log("h1.dong:", h1.dong)
    h1.dong = 'DONG'
    log("h1.dong:", h1.dong)





    
