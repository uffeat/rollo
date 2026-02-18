Api = globals()['Api']
api = globals()['api']

@api()
class echo(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):

        print("Foo")

        



        return "Boom!"



