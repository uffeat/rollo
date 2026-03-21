"""
type/check.py
"""


def main(use, *args, **kwargs):

    check = use("@@/check/")
    is_instance = use("@@/check:is_instance")
    type_name = use("@@/check:type_name")


    component = use("@@/component/")
    console = use("@@/console/")
    js = use("@@/js/")
    window = use("@@/window/")
    Object = window.Object

    console.clear()

    testers = dict(
        dict=dict(foo=42),
        object=js.object(foo=42),
        list=[1, 2, 3],
        array=js.array(1, 2, 3),
        element=component.div(),
    )

    # Test check
    for method_name in check.methods():
        method = check[method_name]
        for tester_name, tester_value in testers.items():
            result = method(tester_value)
            if method_name == tester_name:
                if result:
                    print(f"{method_name} correctly validated {tester_name}")
                else:
                    console.warn(f"{method_name} failed to validate {tester_name}")
            else:
                if result:
                    console.warn(f"{method_name} failed to invalidate {tester_name}")

                else:
                    print(f"{method_name} correctly invalidated {tester_name}")


    
    print("object is instance of dict:", is_instance(testers['object'], dict))
    print("object is instance of Object:", is_instance(testers['object'], Object))

    print("dict is instance of dict:", is_instance(testers['dict'], dict))
    print("dict is instance of Object:", is_instance(testers['dict'], Object))

    def _isinstance(value, ref) -> bool:
        """Single-ref version of isinstance that circumvents Python's
        'bool is int'-quirk."""
        if value in [False, True] and ref is int:
            return False
        if not isinstance(ref, type):
            return False
        
    def is_instance(value, *refs) -> bool:

        for ref in refs:
            if js.instance(value, ref) or _isinstance(value, ref):
                return True
        return False
        
    print("dict is instance of Object:", _isinstance(testers['dict'], Object))
    print("dict is instance of Object:", js.instance(testers['dict'], Object))
    print("dict is instance of Object:", is_instance(testers['dict'], Object))
