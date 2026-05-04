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

    class Css:
        def __init__(self, node, **updates):
            self.__dict__["_"] = dict(node=node)
            self(**updates)

        def __call__(self, **updates):
            """Updates CSS vars."""
            # NOTE False deletes
            for key, value in updates.items():
                self.set(key, value)

        def __contains__(self, value: str):
            return self.has(value)

        @property
        def node(self):
            return self._["node"]

        def get(self, key: str):
            """Returns CSS vars."""
            key = f"--{key}"
            if self.node.isConnected:
                value = native.getComputedStyle(self.node).getPropertyValue(key).strip()
            else:
                value = self.node.style.getPropertyValue(key)
                if not value:
                    return False
                priority = self.node.style.getPropertyPriority(key)
                if priority:
                    return f"{value} !{priority}"
                if value == "none":
                    return
                return value

        def has(self, key: str) -> bool:
            if self.node.isConnected:
                return bool(
                    native.getComputedStyle(self.node).getPropertyValue(key).strip()
                )
            return bool(self.node.style.getPropertyValue(key))

        def set(self, key: str, value):
            """Updates CSS var."""
            key = f"--{key}"
            if value is None:
                value = "none"
            elif value == 0:
                value = "0"
            current = self.get(key)
            # Abourt if no change
            if current == value:
                return
            if value is False:
                self.node.style.removeProperty(key)
            else:
                if isinstance(value, str):
                    value = value.strip()
                    # Handle priority
                    if value.endswith("!important"):
                        self.node.style.setProperty(key, value[: -len("!important")])
                    else:
                        self.node.style.setProperty(key, value)
                else:
                    self.node.style.setProperty(key, value)



    return dict(Css=Css)
