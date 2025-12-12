import json
import traceback
from pathlib import Path
from anvil import app
from anvil.secrets import get_secret
from anvil.server import (
    HttpResponse,
    connect,
    http_endpoint,
    request as http_request,
    wait_forever as keep_connection,
)


def main():
    """."""
    key = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
        "development"
    ]["server"]

    connect(key)

    ##print("http_request:", http_request)##

    class api:
        def __init__(self, name=None):
            self.name = name

        def __call__(self, target):
            self.name = self.name if self.name else target.__name__.lower()
            target = target()

            def wrapper(submission=None):
                # Prepare http_response
                http_response = HttpResponse(status=200)
                http_response.headers["content-type"] = (
                    "application/json; charset=utf-8"
                )
                http_response.headers["access-control-allow-origin"] = "*"
                # Interpret submission
                submission = None if submission is None else int(submission)
                # Parse body
                parsed_body: dict = json.loads(
                    http_request.body.get_bytes().decode("utf-8")
                )
                access_key = parsed_body.pop("__key__", None)
                # Handle access
                if access_key != key:
                    return HttpResponse(status=401)
                # Extract data-part from request_data
                request_data = parsed_body.pop("data", None)
                # Prepare meta
                meta = dict(submission=submission, name=self.name, env=app.environment.name)
                # Get result from target
                try:
                    result = target(submission=submission, data=request_data)
                    # Complete http_response without error
                    http_response.body = json.dumps(
                        dict(data=result, meta=meta)
                    )
                except:
                    # Complete http_response with error
                    http_response.body = json.dumps(
                        dict(__error__=traceback.format_exc(), meta=meta)
                    )

                return http_response

            # Register
            http_endpoint(f"/{self.name}", methods=["POST"])(wrapper)
            return target.__class__

    @api()
    class echo:
        def __call__(self, submission=None, data=None):
            100/0
            return data

    keep_connection()


if __name__ == "__main__":
    main()
