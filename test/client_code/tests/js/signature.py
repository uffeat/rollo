"""
js/signature.py
"""


def main(use, *args, **kwargs):

    check = use("@@/check/")
    console = use("@@/console/")
    js = use("@@/js/")

    console.clear()

    _array = js.array(1, 2, 3)
    _list = [1, 2, 3]
    _dict = dict(foo=42)
    _object = js.object(foo=42)

    ##print('type:', js.type(_object))
    ##console.log('_object:', _object)

    def test(*args, **kwargs):
        """."""
        ##print('Incoming args:', args)
        ##print('Incoming kwargs:', kwargs)

        args = js.signature(args, kwargs)

        print("Pythonized args:", args)
        print("Pythonized kwargs:", kwargs)

    test(_object, *_array)
    test(*_array)
