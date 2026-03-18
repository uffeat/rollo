from datetime import date, datetime, timedelta, timezone


class Date:

    @classmethod
    def now(cls):
        return cls(value=datetime.now(timezone.utc))

    def __init__(self, value=None):
        self._ = dict(value=value)

    def __call__(self):
        value = self._.get("value")
        if isinstance(value, (date, datetime)):
            return value.isoformat()
        if isinstance(value, str):
            return datetime.datetime.fromisoformat(value)
