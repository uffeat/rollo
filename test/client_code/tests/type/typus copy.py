"""
type/typus.py
"""


def main(use, *args, **kwargs):

    component = use("@@/component/")
    console = use("@@/console/")
    js = use("@@/tools").js
    window = use("@@/window/")

    console.clear()

    Object = window.Object
    jsEval = window.eval
    Function = window.Function
    HTMLElement = window.HTMLElement

    class typus:
        """Utility for cross-Python-JS type-checking in Anvil client code.
        XXX A shot of latin to prevent concursus with built-ins."""

        def __init__(self):

            def _isinstance(value, ref):
                """Single-ref version of isinstance that circumvents Python's
                'bool is int'-quirk."""
                if value in [False, True] and ref is int:
                    return False
                return isinstance(value, ref)

            self.__ = dict(
                instanceof=Function("value, ref", "return value instanceof ref"),
                isinstance=_isinstance,
            )

        def __call__(self, *args, **kwargs) -> bool:
            return self.exemplum(*args, **kwargs)

        def __getitem__(self, key: str):
            return self.__.get(key)

        def __getattr__(self, key: str):
            return self[key]

        def exemplum(self, value, *refs) -> bool:
            """Hybrid instanceof-isinstance."""
            name = self.nomen(value)
            if self.lingua(name) == "js":
                for ref in refs:
                    if self.instanceof(value, ref):
                        return True
                return False
            else:
                # py
                for ref in refs:
                    if self.isinstance(value, ref):
                        return True
                return False

        def lingua(self, name: str) -> str:
            """Returns indication of, which language realm a given name-based
            type belongs to."""
            return 'js' if bool(window[name]) else 'py'
            try:
                jsEval(name)
                return "js"
            except:
                return "py"

        def nomen(self, value) -> str:
            """Returns type name."""
            if value == "..." or value is ...:
                """XXX Python does not have the concept of undefined and JS does
                not have the concept of ellipsis -> use '...' as a pseudo undefined.
                Beware, that '...' is truthy."""
                return "..."
            # Get py type name
            name = str(type(value))[8:-2]
            if self.lingua(name) == "js":
                # Get js type name
                return Object.prototype.toString.call(value)[8:-1]
            return name
        
        def object(self, key: str):
            """."""
            return window[key]
        

        def test(self, value, *refs) -> bool:
            """Tests value against type names."""
            name = self.nomen(value)
            ##print("type name of value:", name)  ##
            for ref in refs:
                if ref[0] == "!":
                    if name == ref[1:]:
                        return
                    continue
                else:
                    if name != ref:
                        return False
            return True

    typus = typus()

    # Test

    

    _dict = {"foo": 42}
    _list = [1, 2, 3]
    _object = js.object(foo=42)
    _array = window.Array(1, 2, 3)

    console.log('_array:', _array)


    true = Function("return true")()
    false = Function("return false")()
    null = Function("return null")()
    _component = component.div()

    ##print("true type name:", typus.nomen(true))
    ##print("True type name:", typus.nomen(True))

    ##print("false type name:", typus.nomen(false))
    ##print("False type name:", typus.nomen(False))

    print("... type name:", typus.nomen(...))
    print("_component type name:", typus.nomen(_component))
    print("_dict type name:", typus.nomen(_dict))
    print("_object type name:", typus.nomen(_object))

    print(
        "_component is instance of HTMLElement:",
        typus.exemplum(_component, HTMLElement),
    )
    print("True is instance of int:", typus(True, int))
    print("True is instance of bool:", typus(True, bool))
    print("42 is instance of int:", typus(42, int))
    print("_object is instance of Object", typus(_object, typus.object('Object')))
    print("_dict is instance of Object", typus(_dict, typus.object('Object')))

    ##print("_dict is Object:", typus.test(_dict, "Object", "!dict"))
    ##print("_object is Object:", typus.test(_object, "Object", "!dict"))
