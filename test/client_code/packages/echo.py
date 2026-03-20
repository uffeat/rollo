def main(use, *args, **kwargs):
    """Replaces echo package."""
    
    print("Using injected echo package")

    class echo:
        def __call__(self, *args, **kwargs):
            return "BOOM!"

    echo = echo()

    def ping(*args, **kwargs):
        return "INJECTED PING"

    return dict(echo=echo, ping=ping)
