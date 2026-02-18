import json
from pathlib import Path

from anvil.server import (
    callable as callable_,
    connect,
    wait_forever,
)


def main():
    """Provides DEV client access to server api's and iworker."""
    key = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
        "development"
    ]["server"]

    connect(key)

    @callable_
    def _access():
        return True
    
    @callable_
    def _log(*args):
        print(*args)

    print("Running local server for access and logging.")

    wait_forever()


if __name__ == "__main__":
    main()
