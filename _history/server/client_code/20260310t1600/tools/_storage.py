import json
from anvil.js.window import localStorage



def Storage():

    class proxy:

        def __getitem__(self, name: str):
            value: str = localStorage.getItem(name)
            if value.strip() == '':
                return
            try:
                value = json.loads(value)
            except:
                pass
            return value

        def __setitem__(self, name: str, value):
            if not isinstance(value, str):
                try:
                    value=json.dumps(value)
                except:
                    pass
            localStorage.setItem(name, value)

        def __getattr__(self, name):
            return self[name]

        def __setattr__(self, name, value):
            self[name] = value

    return proxy()


Storage = Storage()
