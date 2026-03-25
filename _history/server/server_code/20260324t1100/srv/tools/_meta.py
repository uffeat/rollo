from anvil import app
from  anvil.server import get_app_origin


class client:
    @property
    def origin(self):
        return "https://rolloh.vercel.app"


client = client()


_ = dict(
    DEV=app.environment.name == "development",
    PROD=app.environment.name == "production",
    client=client,
    env=app.environment.name,
    origin=get_app_origin,
)


class meta:

    def __call__(self, **updates):
        _.update(updates)
        return self

    def __getitem__(self, key):
        value = _.get(key)
        if callable(value):
            value = value()
            _[key] = value
        return value

    def __getattr__(self, key):
        return self[key]

    def __setitem__(self, key, value):
        self(**{key: value})

    def __setattr__(self, key, value):
        self[key] = value


meta = meta()
