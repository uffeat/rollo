import json
from pathlib import Path
from anvil.server import connect as _connect, wait_forever




def connect(message: str = "", server: bool=True) -> callable:
    

    _connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
            "development"
        ]["server" if server else 'client']
    )

    message and print(message)

    
    
    def keep(message: str = ""):
        message and print(message)
        if server:
            # HACK Sometimes fails at first run
            try:
                wait_forever()
            except:
                wait_forever()

    return keep
