class Data:
    def __init__(self, **data):
        self.__dict__["_data"] = data

    def __call__(self, **updates) -> "Data":
        self._data.update(updates)
        return self

    def __contains__(self, key):
        return key in self._data

    def __delattr__(self, key):
        del self._data[key]

    def __eq__(self, other):
        if isinstance(other, Data):
            return self._data == other._data
        return self._data == other

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self._data.get(key, ...)

    def __iter__(self):
        return iter(self._data.items())

    def __len__(self):
        return len(self._data)

    def __setattr__(self, key, value):
        self[key] = value

    def __setitem__(self, key, value):
        self._data[key] = value

    def __str__(self):
        return str(self._data)

    def clear(self) -> "Data":
        self._data.clear()
        return self

    def copy(self) -> "Data":
        return Data(**self._data.copy())

    def freeze(self):
        from types import MappingProxyType

        if not isinstance(self._data, MappingProxyType):
            self.__dict__["_data"] = MappingProxyType(self._data)
        return self

    def remove(self, key):
        return self._data.pop(key, ...)
