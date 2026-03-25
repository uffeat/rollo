import json

class State:
    def __init__(self, session):
        """."""
        _ = session.get("state")
        if _ is None or not isinstance(_, dict):
            _ = {}
            session["state"] = _
        self._ = _

    def __call__(self, **updates):
        """."""
        self._.update(updates)
        return self

    def __getitem__(self, key: str):
        return self._.get(key)

    def __getattr__(self, key: str):
        return self[key]
    
    @property
    def dto(self):
        """."""
        return self._

    def serialize(self):
        """."""
        return json.dumps(self._)

