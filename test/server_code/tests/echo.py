Api = globals()["Api"]
api = globals()["api"]


@api()
class echo(Api):
    def __init__(self, *args, **kwargs):
        ##print("args", args)
        ##print("kwargs:", kwargs)
        super().__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):

        ##print("meta", self.meta)
        ##print("state:", self.state)

        public_state = self.state['public']
        _public_state = self.meta['state']

        print("id:", id(public_state))
        print("id:", id(_public_state))




        

        return "Boom!"
