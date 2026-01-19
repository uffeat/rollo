"""
type/types.py
"""


def main(use):

   
    instanceOf = use("@@/tools").instanceOf
    tools = use("@@/tools")
    typeName = use("@@/tools:typeName")
    type_name = use("@@/tools:type_name")
    typeOf = use("@@/tools:typeOf")

    Object = use.window.Object
    Function = use.window.Function

    print(typeName(0))

    print(type_name(0))

    result = tools.is_instance(False, "int")
    print("result:", result)

    def my_function():
        """"""

    print(type_name(my_function))

    print(instanceOf(my_function, Function))

    print(typeOf(my_function))
