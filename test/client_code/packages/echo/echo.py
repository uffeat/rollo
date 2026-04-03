def main(use, *args, **kwargs):
    """Replaces echo package."""

    def bad(*args, **kwargs):
        impossible = 5 / 0
    
    

    class echo:
        def __call__(self, *args, **kwargs):
            return "BOOM!"

    echo = echo()

    def ping(*args, **kwargs):
        return "INJECTED PING"
    
    use.console.warn("Using injected echo package")

    return dict(bad=bad, echo=echo, ping=ping)
