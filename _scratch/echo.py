import json
from pathlib import Path
from anvil.server import (
    call,
    connect,
   
)

UTF_8 = "utf-8"


from anvil.server import call, connect
connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
            "development"
        ]["client"]
    )


response = call('main', 'echo', request=dict(args=[42]), submission=0)

print('response:', response)

result = response['result']


result = json.dumps(result)

print('result:', result)