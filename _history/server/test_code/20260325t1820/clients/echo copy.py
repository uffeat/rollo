import json
from pathlib import Path
from anvil.server import (
    call,
    connect,
)

from tools import connect


connect()

from client_code.rpc import rpc




response = echo('POW!')
print("result:", response["result"])
print("meta:", response["meta"])

response = echo('BOOM!')
print("result:", response["result"])
print("meta:", response["meta"])




