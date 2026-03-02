from .tools import Api, api


@api()
class echo(Api):
    """NOTE For verification."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):

       

        if "history" in self.state.public:
            self.state.public(history=[*self.state.public.history, self.meta["submission"]])
        else:
            self.state.public(history=[self.meta["submission"]])

        if args and kwargs:
            return [kwargs, args]
        if args and not kwargs:
            if len(args) == 1:
                return args[0]
            return args
        if not args and kwargs:
            return kwargs
