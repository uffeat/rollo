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


    def rip(cls) -> tuple:
        """Returns methods (list), getters (dict) and setters (dict) for Python class."""
        methods = []
        properties = {}
        # Reverse mro to ensure that highest priority overloads (if name collisions):
        for cls in reversed(cls.mro()):
            attrs = {k: v for k, v in cls.__dict__.items() if not k.startswith("__")}
            methods.extend([m for m in attrs.values() if "function" in str(type(m))])
            properties.update(
                {k: v for k, v in attrs.items() if "property" in str(type(v))}
            )
        getters = {k: v.fget for k, v in properties.items() if v.fget}
        setters = {k: v.fset for k, v in properties.items() if v.fset}
        return methods, getters, setters
    

    class MyClass:
        def __init__(self):
            self._ = dict(foo=42)

        def __call__(self, *args, **kwds):
            pass

        def stuff(self):
            return 'STUFF'
        
    result = rip(MyClass)
    log('result:', result)
    

    




