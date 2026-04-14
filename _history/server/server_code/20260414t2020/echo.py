from .tools import Api, log



class XXXecho(Api):
    """NOTE For verification."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, *args, **kwargs):
        if len(args) == 1 and not kwargs:
            return args[0]
        if args and not kwargs:
            return args
        if not args and kwargs:
            return kwargs
        if args and kwargs:
            return args, kwargs

