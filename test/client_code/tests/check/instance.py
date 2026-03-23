"""
check/instance.py
"""


def main(use, *args, **kwargs):

    check = use("@@/check/")
    console = use("@@/console/")
    js = use("@@/js/")

    console.clear()

    _array = js.array(1, 2, 3)
    _list = list([1, 2, 3])
    _dict = dict(foo=42)
    _object = js.object(foo=42)

    print("_object is Object:", check.instance(_object, "Object"))
    print("_object is dict:", check.instance(_object, "dict"))

    print("_dict is dict:", check.instance(_dict, "dict"))
    print("_dict is Object:", check.instance(_dict, "Object"))

    print("_array is Array:", check.instance(_array, "Array"))
    print("_array is list:", check.instance(_array, "list"))

    print("_list is list:", check.instance(_list, "list"))
    print("_list is Array:", check.instance(_list, "Array"))

    print("8.8 is float:", check.instance(8.8, "float"))
    print("42 is int:", check.instance(42, "int"))
    print("'foo' is str:", check.instance("foo", "str"))
    print("True is int:", check.instance("foo", "int"))
