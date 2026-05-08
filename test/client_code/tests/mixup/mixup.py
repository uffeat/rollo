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

    Object = use("@@/js").Object

    

    class mixup:

        def __init__(self, target):
            self._ = dict(target=target)

        def __call__(self, source: type):
            _keys = []

            def keys(*args):
                return [*_keys]
            
            self.add_method('__keys__', keys)


            for key, value in source.__dict__.items():
                if key == "__init__":
                    value(self.target)
                    continue
                if key.startswith("__") and key.endswith("__"):
                    continue
                if type(value).__name__ == "function":
                    _keys.append(key)
                    self.add_method(key, value)
                    continue
                if isinstance(value, property):
                    _keys.append(key)
                    self.add_property(key, value)
                    continue

        @property
        def target(self):
            return self._.get("target")

        def add_method(self, key: str, value: callable):

            def wrapper(*args, **kwargs):
                return value(self.target, *args, **kwargs)

            setattr(wrapper, "__annotations__", getattr(value, "__annotations__", {}))
            setattr(wrapper, "__defaults__", getattr(value, "__defaults__", ""))
            setattr(wrapper, "__doc__", getattr(value, "__doc__", ""))
            setattr(wrapper, "__name__", getattr(value, "__name__", ""))

            Object.defineProperty(
                self.target,
                key,
                dict(
                    configurable=True,
                    enumerable=True,
                    writable=True,
                    value=wrapper,
                ),
            )

        def add_property(self, key: str, value: property):

            def get():
                return value.fget(self.target)

            options = dict(
                configurable=True,
                enumerable=False,
                get=get,
            )

            if value.fset:

                def set(v):
                    return value.fset(self.target, v)

                options.update(set=set)

            Object.defineProperty(
                self.target,
                key,
                options,
            )

    

    element = document.createElement("div")

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
    ##element.dong = "BAD"
    log("element.__keys__():", element.__keys__())  ##
