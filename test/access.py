import json
from pathlib import Path

from anvil.server import (
    callable as callable_,
    connect,
    wait_forever as keep_connection,
)


def main():
    """Provides DEV client access to server api's and iworker."""
    key = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
        "development"
    ]["server"]

    connect(key)

    @callable_
    def access():
        return True

    keep_connection()


if __name__ == "__main__":
    main()
