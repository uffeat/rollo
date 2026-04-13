import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    callable as rpc,
    connect,
    http_endpoint,
    wait_forever,
)

UTF_8 = "utf-8"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
    "development"
]["server"]
ASSETS = "test/assets"


def main():

    @http_endpoint("/_assets")
    def _assets(path: str = None):
        body = (Path.cwd() / f"{ASSETS}/{path}").read_text(encoding=UTF_8)
        return HttpResponse(
            body=body,
            headers={
                "access-control-allow-origin": "*",
            },
        )

    @rpc
    def _assets(path: str):
        return (Path.cwd() / f"{ASSETS}/{path}").read_text(encoding=UTF_8)


if __name__ == "__main__":
    connect(KEY)
    main()
    print("Running local server for asset injection.")
    # HACK Script sometimes fails at first run
    try:
        wait_forever()
    except:
        wait_forever()
