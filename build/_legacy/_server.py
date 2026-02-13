import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    callable as rpc,
    connect,
    http_endpoint as api,
    wait_forever as keep_connection,
)

from assets import build as assets
from anvil_assets import build as anvil_assets

UTF_8 = "utf-8"


class server:
    def __init__(self):
        """."""
        self.actions = {"anvil_assets": anvil_assets, "assets": assets}

    def __call__(self):
        """Spins up local server to allow controlling build tools from a local web app."""

        connect(
            (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
                "development"
            ]["server"]
        )

        @api("/build/:action")
        def build(action: str):
            """."""

            result = self.actions.get(action)
            if result:
                result = result()

            return HttpResponse(
                body=result,
                headers={
                    "access-control-allow-origin": "*",
                },
            )

        @rpc
        def build(action: str):
            """."""
            result = self.actions.get(action)
            if result:
                result = result()
            
            return result

        keep_connection()


server = server()

if __name__ == "__main__":
    server()
