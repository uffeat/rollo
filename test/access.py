import json
from pathlib import Path

from anvil.server import (
    callable as rpc,
    connect,
    disconnect,
    wait_forever,
)

key = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
    "development"
]["server"]


def main():
    """Provides DEV client access to server api's and iworker."""

    @rpc
    def _access():
        """."""
        return True

    @rpc
    def _log(*args):
        print(*args)


if __name__ == "__main__":
    ##disconnect()
    connect(key)
    main()
    print("Running local server for access and logging.")
    wait_forever()
