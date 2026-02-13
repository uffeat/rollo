"""TODO
- Option to serve asset as default export in module
"""

import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    connect,
    http_endpoint as api,
    wait_forever as keep_connection,
)


def main():
    """."""
    connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
            "development"
        ]["server"]
    )

    @api("/assets")
    def assets(path: str = None):
        return HttpResponse(
            body=(Path.cwd() / f"_build/assets/assets/assets{path}").read_text(encoding="utf-8"),
            headers={
                "access-control-allow-origin": "*",
            },
        )

    keep_connection()


if __name__ == "__main__":
    main()
