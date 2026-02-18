import json
from pathlib import Path
from anvil.server import (
    HttpResponse,
    callable as callable_,
    connect,
    http_endpoint,
    wait_forever,
)

UTF_8 = "utf-8"
TESTS = "test/server_code/tests"


def main():
    """."""
    connect(
        (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
            "development"
        ]["server"]
    )

    @callable_
    def _access():
        return True

    @callable_
    def _get_api_text(name: str):
        text = (Path.cwd() / f"{TESTS}/{name}.py").read_text(encoding=UTF_8)
        return [p for p in reversed(text.partition('"""XXX"""')) if p][0]

    @callable_
    def _log(*args):
        print(*args)

    print("Running local server for server endpoint injection.")

    wait_forever()


if __name__ == "__main__":
    main()
