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

PACKAGES = "test/client_code/packages"
TESTS = "test/client_code/tests"


def main():
    """Spins up local server that serves local Python test scripts as text.
    NOTE In combination with, e.g., a 'test' Form served live from a '/test' route,
    this allows running uncommitted tests with full access to the Anvil
    client code runtime - without tests polluting the served bundle.
    This is enabled by the 'use' import engine. Accordingly, test scripts should
    contain a single 'main' function member that accepts a 'use' arg."""

    @http_endpoint("/_test")
    def test(path: str = None):
        body = (Path.cwd() / f"{TESTS}/{path}").read_text(encoding=UTF_8)
        return HttpResponse(
            body=body,
            headers={
                "access-control-allow-origin": "*",
            },
        )

    @rpc
    def _test(path: str):
        return (Path.cwd() / f"{TESTS}/{path}").read_text(encoding=UTF_8)

    @rpc
    def _package(name: str):
        return (Path.cwd() / f"{PACKAGES}/{name}.py").read_text(encoding=UTF_8)

    @rpc
    def _access():
        return True

    @rpc
    def _log(*args):
        print(*args)


if __name__ == "__main__":
    key = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
        "development"
    ]["server"]
    connect(key)
    main()
    print("Running local server for client-code test injection.")
    wait_forever()
