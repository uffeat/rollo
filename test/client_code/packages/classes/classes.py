def main(use, *args, **kwargs):
    use("@@/assets/")
    anvil, console, document, js, log, meta, native, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")

    class Classes:
        def __init__(self, node, **updates):
            self.__dict__["_"] = dict(node=node)
            self(**updates)

        def __call__(self, **updates):
            """Updates CSS classes."""
            # NOTE True adds; False removes
            for key, value in updates.items():
                if value:
                    self.add(key)
                else:
                    self.remove(key)

        def __contains__(self, value: str):
            return self.has(value)

        def __len__(self):
            return self.node.classList.length

        @property
        def node(self):
            return self._["node"]

        @property
        def size(self):
            return self.node.classList.length

        def add(self, *specifiers):
            for value in self.parse(specifiers):
                if not self.has(value):
                    self.node.classList.add(value)

        def clear(self):
            self.remove(*self.node.classList)

        def has(self, value: str) -> bool:
            return self.node.classList.contains(value)

        @staticmethod
        def parse(specifiers):
            values = []
            for specifier in specifiers:
                values.extend(specifier.split("."))
            return values

        def remove(self, *specifiers):
            for value in self.parse(specifiers):
                if self.has(value):
                    self.node.classList.remove(value)

        def replace(self, previous, current):
            self.node.classList.replace(previous, current)

        def toggle(self, *specifiers):
            for value in self.parse(specifiers):
                if self.has(value):
                    self.remove(value)
                else:
                    self.add(value)

        def values(self):
            return [v for v in self.node.classList]



    return dict(Classes=Classes)
