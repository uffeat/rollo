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
    print("'foo' is str:", check.instance('foo', "str"))
    print("True is int:", check.instance('foo', "int"))


    
    
    Array = use("@@/js:Array")
    is_instance = use("@@/check:is_instance")
    type_name = use("@@/check:type_name")
    
    
    
    def probe(value, ref):
        """."""
        #print('value type:', type(value).__name__)
        value_is_py = js.get(type(value).__name__) or False
        #print('value_is_py:', value_is_py)

        ref_is_js = js.get(ref) or False

        if value_is_py and ref_is_js:
            return False



        if ref_is_js and not value_is_py:
            print('ref is js, value is js')
            return js.type(value) == ref
        
        print('ref is py')
        return type_name(value) == ref
    
    def probe(value, ref):
        """."""
        return isinstance(ref, type)


        if js.get(type(ref).__name__):
            print('ref is js')
            return js.instance(value, ref, strict=False)
        
        print('ref is py')
        return is_instance(value, ref)


    #print("_array is Array:", probe(_array, 'Array'))
    #print("_array is list:", probe(_array, 'list'))

    #print("_list is list:", probe(_list, 'list'))
    print("_list is Array:", probe(_list, Array))
    
    
    
