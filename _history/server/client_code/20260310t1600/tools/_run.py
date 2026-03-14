class run:
    def __init__(self):
        """."""

    def __call__(self, target):
        if isinstance(target, type):
            target = target()
        return target()
    


