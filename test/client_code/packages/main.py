def main(use, *args, **kwargs):
    """Replaces main package."""

    works = use("@@/works/")
    Base = use("@@/mixins").Base
    Shadow = use("@@/mixins").Shadow
    Promise = use("@@/promise").Promise

    class main(Base, Shadow):

        def __init__(
            self,
            origin: str = None,
            page: str = None,
            path: str = None,
            session_id: str = None,
            targets: list = None,
            **query,
        ):
            Base.setup(self)
            Shadow.setup(self)
            self.attributes(id="main", **{self.__class__.__name__: True})

        @property
        def child(self):
            """Returns child component."""
            if self.children:
                return self.children[0]

        @child.setter
        def child(self, child):
            """Sets child component."""
            self.append(child)

        def open(self):
            "Makes component top-level."
            if works.get_open_form() is not self:
                works.open_form(self)
            return self

    main = main()
    works.open_form(main)

    # Integrate with import engine
    @use.processor("component.py")
    def handler(cls, *args, owner=None, path=None, **options):
        ##log("options:", options, trace=__file__)  ##
        def process(*args, **kwargs):
            instance = cls(**options) if "__init__" in cls.__dict__ else cls()
            main.child = instance
            result = instance(*args, **kwargs) if callable(instance) else None
            if isinstance(result, Promise):
                result = result.wait()
            main.clear()
            return result

        return process

    print("Using injected main package")

    return main
