import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    callable as callable_,
    connect,
    http_endpoint,
    wait_forever as keep_connection,
)

UTF_8 = "utf-8"
TESTS = "test/client_code/tests"


def main():
    """Spins up local server that serves local Python test scripts as text.
    NOTE In combination with, e.g., a 'test' Form served live from a '/test' route,
    this allows running uncommitted tests with full access to the Anvil
    client code runtime - without tests polluting the served bundle.
    This is enabled by the 'use' import engine. Accordingly, test scripts should
    contain a single 'main' function member that accepts a 'use' arg."""
    connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
            "development"
        ]["server"]
    )

    @http_endpoint("/test")
    def test(path: str = None):
        if path:
            body = (Path.cwd() / f"{TESTS}/{path}").read_text(encoding=UTF_8)
        else:
            body = ""
        return HttpResponse(
            body=body,
            headers={
                "access-control-allow-origin": "*",
            },
        )

    @callable_
    def test(path: str = None):
        if path:
            return (Path.cwd() / f"{TESTS}/{path}").read_text(encoding=UTF_8)
        return True

    keep_connection()


if __name__ == "__main__":
    main()
