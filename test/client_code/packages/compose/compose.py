def main(use, *args, **kwargs):

    Object = use("@@/js").Object

    class compose:
        def __init__(self, target):
            self._ = dict(target=target)

        def __call__(self, composition: type):
            instance = composition(self.target)

            Object.defineProperty(
                self.target,
                composition.__name__,
                dict(
                    configurable=True,
                    enumerable=False,
                    get=lambda: instance,
                ),
            )
            return composition

        @property
        def target(self):
            return self._.get("target")

    return dict(compose=compose)
