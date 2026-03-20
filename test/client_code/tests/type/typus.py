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
    Function = window.Function
    HTMLElement = window.HTMLElement

    class typus:
        """Utility for cross-Python-JS type-checking in Anvil client code."""

        def __init__(self):

            def py_type_name(value):
                """."""
                return str(type(value))[8:-2]

            def js_type_name(value):
                """."""
                return Object.prototype.toString.call(value)[8:-1]

            def is_js(value):
                """Tests is JS."""
                return py_type_name(value) == "Proxy"

            _instanceof = Function("value, ref", "return value instanceof ref")

            def instanceof(value, ref):
                """."""
                if not is_js(value) or not is_js(ref):
                    return False
                return _instanceof(value, ref)

            def _isinstance(value, ref) -> bool:
                """Single-ref version of isinstance that circumvents Python's
                'bool is int'-quirk."""
                if value in [False, True] and ref is int:
                    return False
                if not isinstance(ref, type):
                    return False
                return isinstance(value, ref)

            self.__ = dict(
                instanceof=instanceof,
                isinstance=_isinstance,
                is_js=is_js,
                js_type_name=js_type_name,
                py_type_name=py_type_name,
            )

        def __call__(self, value, *refs) -> bool:
            """Hybrid instanceof-isinstance."""
            if self.is_js(value):
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

        def __getitem__(self, key: str):
            """Universal pseudo getter."""
            return self.__.get(key)

        def __getattr__(self, key: str):
            return self[key]

        def name(self, value) -> str:
            """Returns type name."""
            if value == "..." or value is ...:
                """XXX Python does not have the concept of undefined and JS does
                not have the concept of ellipsis -> use '...' as a pseudo undefined.
                Beware, that '...' is truthy (as is ...)."""
                return "..."
            # Get py type name
            if self.is_js(value):
                # Get js type name
                return self.js_type_name(value)
            return self.py_type_name(value)

        def object(self, key: str):
            """Returns JS object by name.
            NOTE For convenience, since JS natives must otherwise be explicitly
            imported."""
            return window[key]

        def test(self, value, *refs) -> bool:
            """Tests value against type names."""
            name = self.name(value)
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

    # Test objects and values
    _dict = {"foo": 42}
    _object = js.object(foo=42)
    _array = window.Array(1, 2, 3)
    _list = [1, 2, 3]
    _component = component.div()

    """Type name"""
    # Pseudo undefined
    print("... type name:", typus.name(...))
    print("'...' type name:", typus.name("..."))
    # HTMLElement
    print("_component type name:", typus.name(_component))
    # JS object and dict
    print("_dict type name:", typus.name(_dict))
    print("_object type name:", typus.name(_object))

    """Instance check"""
    # HTMLElement
    print(
        "_component is instance of HTMLElement:",
        typus(_component, HTMLElement),
    )
    # Boolean
    print("True is instance of int:", typus(True, int))
    print("True is instance of bool:", typus(True, bool))
    # Integer
    print("42 is instance of int:", typus(42, int))
    # JS object and dict
    print("_object is instance of Object", typus(_object, typus.object("Object")))
    print("_object is instance of dict", typus(_object, dict))
    print("_dict is instance of Object", typus(_dict, typus.object("Object")))
    print("_dict is instance of dict", typus(_dict, dict))

    """Type name-based test"""
    # JS object and dict
    print("_dict is Object:", typus.test(_dict, "Object", "!dict"))
    print("_object is Object:", typus.test(_object, "Object", "!dict"))
