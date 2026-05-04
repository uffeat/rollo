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
    camel_to_kebab = use("@@/case").camel_to_kebab
    kebab_to_camel = use("@@/case").kebab_to_camel

    class Attributes:
        def __init__(self, node, **updates):
            self.__dict__["_"] = dict(node=node)
            self(**updates)

        def __call__(self, **updates):
            """Updates HTML attributes."""
            # NOTE False and None removes
            for key, value in updates.items():
                self.set(key, value)

        def __contains__(self, key: str):
            return self.has(key)

        def __iter__(self):
            return iter(self.items())

        def __getattr__(self, key: str):
            return self.get(key)

        def __getitem__(self, key: str):
            return self.get(key)

        def __setitem__(self, key: str, value):
            self.set(key, value)

        @property
        def attributes(self) -> dict:
            return {
                kebab_to_camel(item.name): self.get(item.name)
                for item in self.node.attributes
                if item.name not in ["class", "style"]
            }

        @property
        def node(self):
            return self._["node"]

        def get(self, key: str):
            """Updates HTML attribute."""
            key = camel_to_kebab(key)
            if self.has(key):
                raw: str = self.node.getAttribute(key).strip()
                if not raw:
                    return True
                if raw.isdigit():
                    return int(raw)
                if raw.startswith("+") or raw.startswith("-"):
                    try:
                        return float(raw)
                    except:
                        return raw
                if raw.startswith("[") or raw.startswith("{"):
                    try:
                        return json.loads(raw)
                    except:
                        return raw
                return raw

        def clear(self):
            for name in [item.name for item in self.node.attributes]:
                if name in ["class", "style"]:
                    continue
                self.node.removeAttribute(name)

        def has(self, key: str) -> bool:
            key = camel_to_kebab(key)
            return self.node.hasAttribute(key)

        def items(self):
            return (
                (kebab_to_camel(item.name), self.get(item.name))
                for item in self.node.attributes
                if item.name not in ["class", "style"]
            )

        def keys(self):
            return (
                kebab_to_camel(item.name)
                for item in self.node.attributes
                if item.name not in ["class", "style"]
            )

        def remove(self, key: str):
            key = camel_to_kebab(key)
            self.node.removeAttribute(key)

        def set(self, key: str, value):
            """Returns HTML attribute."""
            key = camel_to_kebab(key)
            # Compare with current and abort if no change
            current = self.get(key)
            if isinstance(value, str):
                value = value.strip()
            if current == value:
                return
            # Set new
            if value in [False, None]:
                self.remove(key)
                return
            if value is True:
                self.node.setAttribute(key, "")
                return
            if isinstance(value, float):
                sign = "+" if value > 0 else "-"
                self.node.setAttribute(key, f"{sign}{value}")
            if isinstance(value, (dict, list, tuple)):
                try:
                    value = json.dumps(value)
                except:
                    pass
            self.node.setAttribute(key, value)

        def values(self):
            return (
                self.get(item.name)
                for item in self.node.attributes
                if item.name not in ["class", "style"]
            )



    return dict(Attributes=Attributes)
