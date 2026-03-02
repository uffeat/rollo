from datetime import datetime, timezone
import copy
from types import MappingProxyType
from anvil.tables import app_tables

class Slice:
    """Base class for private/public state slices."""
    def __init__(self, owner: 'State', tag: str):
        from anvil.server import session

        data = session.get(tag)
        if data is None:
            data = {}
            session[tag] = data

        self._ = dict(data=data, owner=owner)

    def __call__(self, **updates) -> dict:
        """Updates and returns state.
        NOTE By convention, None removes item; keeps state lean and enables 
        deletion via update.
        XXX When used in a non-test context, it would be possible to mutate the 
        underlying state data directly. That would, however, break alignment with 
        DbSlice. For that reasons a deep copy is returned."""
        data = self._["data"]
        for key, value in updates.items():
            if value is None:
                del data[key]
            else:
                data[key] = value
        return copy.deepcopy(data)

    def __contains__(self, key) -> bool:
        return key in self()

    def __getattr__(self, key):
        return self[key]

    def __getitem__(self, key):
        return self().get(key)

    def __len__(self) -> int:
        return len(self())

    def clear(self) -> 'Slice':
        self().clear()
        return self

    def has(self, key) -> bool:
        return key in self()

    def pop(self, key):
        return self().pop(key, None)


class DbSlice(Slice):
    """Variant of Slice intended for cases, where session cannot be used:
    - Requests from non-same-origin (session is available, but recreated for each call).
    - Endpoints served from local uplink server (session not available).
    HACK
    - Intended for testing
    """
    def __init__(self, owner: 'State', tag: str):
        self._ = dict(owner=owner, tag=tag)

    def __call__(self, **updates) -> dict:
        row = self._get_row()
        tag = self._["tag"]
        data = row[tag]
        for key, value in updates.items():
            if value is None:
                del data[key]
            else:
                data[key] = value
        row[tag] = data
        return data

    def clear(self, future: bool = False):
        if future:
            self._["clear"] = True
        else:
            del self._["clear"]
            self._get_row()[self._["tag"]] = {}
        return self

    def _get_row(self):
        """Sets and returns row lazily."""
        if not self._.get("row"):
            clear = self._.pop("clear", False)
            row = app_tables.states.get(id=self._["owner"].id)
            if row:
                if clear:
                    row[self._["tag"]] = {}
            else:
                row = app_tables.states.add_row(
                    id=self._["owner"].id,
                    private={},
                    public={},
                    created=datetime.now(timezone.utc),
                )
            self._["row"] = row
        return self._["row"]


class State:
    """Controller for state persitent across session."""
    def __init__(self, id: str = None, db=False):
        self._ = dict(id=id)
        if db:
            private = DbSlice(self, "private")
            public = DbSlice(self, "public")
        else:
            private = Slice(self, "private")
            public = Slice(self, "public")

        self._.update(dict(private=private, public=public))

    @property
    def id(self):
        """Returns session id."""
        return self._["id"]

    @property
    def private(self):
        """Returns controller for private state."""
        return self._["private"]

    @property
    def public(self):
        """Returns controller for public state.
        NOTE Similar to private state, but included in each response."""
        return self._["public"]