"""."""

import json
from pathlib import Path
import traceback
from anvil import Media
from anvil.server import (
    connect,
    wait_forever as keep_connection,
)


UTF_8 = "utf-8"

connect(
    (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
        "development"
    ]["server"]
)

from anvil.server import (
    context,
    http_endpoint,
    request as http_request,
)
from tools import Blob, PROD, Response, access, api, env

"""XXX Explicitly import endpoints; required since uplink servers do not scan files."""
import echo
import user


class main:
    """Single-point http endpoint that delegates to targets by name.
    Intended for fast zero-preflight client-server coms.
    TODO
    - Allow blob responses with automatic detection based of target result
      type-checking or explicit declaration via options.
      Will require smart detection client-side, perhaps based on type-checking,
      perhaps based on (custom?) response headers.
    """

    ALLOWED_ORIGINS = ("https://rolloh.vercel.app",)

    def __call__(self, name="", submission=None):
        """This is the registered endpoint"""
        # Prepare http_response
        http_response = Response()
        # Control access
        request_origin = http_request.headers.get("origin")
        if not request_origin:
            return Response(status=403)

        if http_request.headers.get("sec-fetch-site") != "same-origin":
            if PROD:
                if context.client.type != "http":
                    return Response(status=403)
                if request_origin not in self.ALLOWED_ORIGINS:
                    return Response(status=403)
            else:
                # NOTE In DEV, a local server must run to provide access.
                if not access():
                    return Response(status=403)
        # Get target and options
        if name in api.registry:
            registered = api.registry[name]
            target = registered["target"]
            options = registered["options"]
            # Interpret submission
            submission = None if submission is None else int(submission)
            """Prepare meta
            NOTE Always included in response and always (a copy to guard against mutation)
            passed into target."""
            meta = dict(
                env=env,
                name=name,
                session_id=None,  # XXX Cannot access 'session' from Uplink
                submission=submission,
                type="api",
            )
            # Handle request
            raw: Media = http_request.body
            if options.get("raw"):
                # raw option -> No need to read request body
                args, kwargs = [], {}
            else:
                data: dict = Blob(content=raw).read().pop("data", {})
                args, kwargs = data.get("args", []), data.get("kwargs", {})
            # Get target result
            if PROD:
                result = target()(*args, meta={**meta}, raw=raw, **kwargs)
                result = result() if callable(result) else result
                body_content = dict(result=result, meta=meta)
            else:
                # NOTE try-except carries a cost, so only do in DEV
                try:
                    result = target()(*args, meta={**meta}, raw=raw, **kwargs)
                    result = result() if callable(result) else result
                    body_content = dict(result=result, meta=meta)
                except:
                    """NOTE MUCH better than bland status codes! Use 'ok' etc.
                    convention inside result for soft validation signal."""
                    body_content = dict(__error__=traceback.format_exc(), meta=meta)
        else:
            body_content = dict(__error__=f"Invalid name: {name}", meta=meta)
        # NOTE body_content is always a dict with a meta item and a result/__error__ item.
        http_response.body = json.dumps(body_content)
        return http_response


main = main()
http_endpoint(f"/main", methods=["POST"])(main)

keep_connection()
