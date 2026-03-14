class rename:
    def __init__(self, name: str):
        self.name = name

    def __call__(self, target: callable) -> callable:
        target.__name__ = self.name
        return target
    

