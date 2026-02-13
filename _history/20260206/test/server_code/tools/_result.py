def Result(ok=True, **data) -> callable:
    data = dict(ok=ok, **data)

    class cls:

        def __call__(self, **updates) -> dict:
            data.update(updates)
            return data

        def __contains__(self, key) -> bool:
            return key in data

        def __getitem__(self, key):
            return data.get(key, ...)

        def __iter__(self):
            return iter(data.items())

        def __len__(self):
            return len(data)

        def __setitem__(self, key, value):
            data[key] = value

        def __getattr__(self, key):
            return self[key]

        def __setattr__(self, key, value):
            self[key] = value

        def clear(self):
            data.clear()
            return self

        def pop(self, key, default=...):
            return data.pop(key, default)

    return cls()
