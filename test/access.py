import json
from pathlib import Path

from anvil.server import (
    callable as rpc,
    connect,
    wait_forever as keep_connection,
)


def main():
    """."""
    key = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
        "development"
    ]["server"]

    connect(key)

    @rpc
    def access():
        return True

    keep_connection()


if __name__ == "__main__":
    main()
