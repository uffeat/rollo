def main(use):
    """."""
    print('Using injected package')
    


    class echo:
        def __call__(self, *args):
            if args:
                if len(args) == 1:
                    return args[0]
                return args


    echo = echo()

    print('Using injected package:', echo.__class__.__name__)

    return echo


    
