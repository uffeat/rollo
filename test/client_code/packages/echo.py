def main(use):
    """."""
    print('Using injected echo package')
    


    class echo:
        def __call__(self, *args, **kwargs):
            return args, kwargs
            


    echo = echo()

    def ping(*args, **kwargs):
        return "ECHO PING"



   

    return dict(echo=echo, ping=ping)


    
