"""
packages/echo/echo.py
"""


def main(use, *args, **kwargs):
    """Tests echo package."""

    console = use("@@/console/")
    console.log("Tests echo package")

    ##
    ##
    


    typeName = use("@@/tools").typeName
    type_name = use("@@/tools").type_name
    is_instance = use("@@/tools").is_instance
    getType = use("@@/tools").getType
    js = use("@@/tools").js


    _dict = {"foo": 42}
    _object = getType('Object')
    _object = js.object()




    print('_dict typeName:', typeName(_dict))
    print('_object type_name:', type_name(_object))
    
    ##print('_dict is Object:', is_instance(_dict, 'Object', '!dict'))
    ##print('Object from name:', getType('Object'))


    ##
    ##

    echo = use("@@/echo/", test=True)
    result = echo(42)
    print("result:", result)

   
