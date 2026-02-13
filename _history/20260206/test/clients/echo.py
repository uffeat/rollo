import json
from pathlib import Path
from anvil.server import call, connect
from tools import rpc


UTF_8 = "utf-8"

connect(
    (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
        "development"
    ]["client"]
)



response = rpc.echo(42)

print('response:', response)