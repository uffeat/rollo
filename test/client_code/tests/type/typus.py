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

    js_eval = window.eval

    class typus:
        """Utility for cross-Python-JS type-checking in Anvil client code."""

        def __init__(self):

            def py_type_name(value):
                """Returns type name as Python sees it."""
                return type(value).__name__

            def js_type_name(value):
                """Returns type name as JS sees it."""
                return Object.prototype.toString.call(value)[8:-1]

            def is_js(value):
                """Tests if JS.
                XXX Feels brittle, since depends of Anvil conventions, 
                which may change... works."""
                return py_type_name(value).startswith("Proxy")
                # Alt:
                return hasattr(value, 'toString')
                

            _instanceof = Function("value, ref", "return value instanceof ref")

            def instanceof(value, ref):
                """Wrapper for the JS instanceof operator."""
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

            # Bundle privates (psudo private, since intentionally exposed via __getitem__)
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
        
        def js(self, value) -> bool:
            """Tests if JS."""
            return self.is_js(value)

        def name(self, value, mode='auto') -> str:
            """Returns type name."""
            if value == "..." or value is ...:
                """XXX Python does not have the concept of undefined and JS does
                not have the concept of ellipsis -> use '...' as a pseudo undefined.
                Beware, that '...' is truthy (as is ...)."""
                return "..."
            if mode == 'auto':
                # Get py type name
                if self.is_js(value):
                    # Get js type name
                    return self.js_type_name(value)
                return self.py_type_name(value)
            if mode == 'js':
                return self.js_type_name(value)
            if mode == 'py':
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
                        return False
                    continue
                else:
                    if name != ref:
                        return False
            return True

    typus = typus()

    # Test objects and values
    _dict = {"foo": 42}
    _object = js.object(foo=42)

    _list = [1, 2, 3]
    _array = window.Array(1, 2, 3)
    
    
    _component = component.div()

    

    ##console.dir(_dict)
    ##console.dir(_object)
    ##print(dir(_dict))
    ##print(dir(_object))
    ##print(_dict.__class__)
    ##print(_object.__class__)
    ##print(_dict.__class__.__name__)
    ##print(_object.__class__.__name__)
    ##print(_list.__class__.__name__)
    ##print(_array.__class__.__name__)
    
    
    

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
    # Array and list
    print("_array is instance of Array", typus(_array, typus.object("Array")))
    print("_array is instance of list", typus(_array, list))
    print("_list is instance of Array", typus(_list, typus.object("Array")))
    print("_list is instance of list", typus(_list, list))

    """Type name-based test"""
    # JS object and dict
    print("_dict is Object and not dict:", typus.test(_dict, "Object", "!dict"))
    print("_object is Object and not dict:", typus.test(_object, "Object", "!dict"))
