import json
import traceback
from anvil import BlobMedia
from anvil.server import call, callable as rpc, context, http_endpoint, request
from anvil.server import session
from .tools import (
    Date,
    DEV,
    PROD,
    Response,
    State,
    access,
    client,
    env,
    log,
    origin,
    session_id,
)

targets = ("echo",)


class Main:
    # Keep as class for future extensions

    def __init__(self): ...

    def __call__(
        self,
        name: str,
        data: dict = None,
        query=None,
        **rest,
    ):
        # Cast query -> ensure it's a dict
        if isinstance(query, str):
            query = json.loads(query)
        elif query is None:
            query = {}
        # Extract test flag from query
        test: bool = query.pop("test", False)
        # Infer request type
        request_type = dict(http="api", browser="rpc").get(context.remote_caller.type)
        # Init server state
        server_state = State(session)
        # Prepare meta
        meta = dict(
            entry=Date.now()(),
            env=env,
            detail={},
            name=name,
            origin=origin,
            request_type=request_type,
            server_state=server_state.dto,
            session_id=session_id,
            submission=query.pop("submission", None),
        )
        # Add test flag to meta (only relevant in DEV)
        if DEV:
            meta.update(dict(test=test))
        # Adapt to request type
        if request_type == "api":
            # Inspect origin
            request_origin = request.headers.get("origin")
            if not request_origin:
                return Response(status=403)
            same_origin = request_origin == origin
            # Control access
            if not same_origin:
                if PROD:
                    if request_origin != client.origin:
                        return Response(status=403)
                else:
                    # NOTE In DEV, a local server must run to provide access.
                    if not access():
                        return Response(status=403)
            # Extract data
            data: dict = json.loads(request.body.get_bytes().decode("utf-8")).pop(
                "data", {}
            )

            def create_response(result, error=False):
                # Update meta
                meta.update(
                    dict(
                        exit=Date.now()(),
                        result_type="" if result is None else type(result).__name__,
                    )
                )
                # Error response
                if error:
                    return Response(
                        body=json.dumps(dict(__error__=result, meta=meta)), cors=True
                    )
                # Blob response
                if hasattr(result, "get_bytes"):
                    return Response(body=result, content_type=None, cors=request_origin)
                # Default response
                return Response(
                    body=json.dumps(dict(result=result, meta=meta)), cors=request_origin
                )
        else:
            request_origin = origin
            same_origin = True

            def create_response(result, error=False) -> dict:
                # Update meta
                meta.update(
                    dict(
                        exit=Date.now()(),
                        result_type="" if result is None else type(result).__name__,
                    )
                )
                # Error response
                if error:
                    return dict(__error__=result, meta=meta)
                # Blob response
                if hasattr(result, "get_bytes"):
                    # HACK Pack original name and meta into blob name -> readable without opening blob
                    name = f'{getattr(result, "name", "")};{json.dumps(meta)}'
                    return BlobMedia(
                        getattr(result, "content_type", "response"),
                        result.get_bytes(),
                        name=name,
                    )
                # Default response
                return dict(result=result, meta=meta)

        # Parse data
        args, kwargs, client_state = (
            data.get("args", []),
            data.get("kwargs", {}),
            data.get("state", {}),
        )
        # Update meta
        meta.update(
            dict(
                client_state=client_state,
                request_origin=request_origin,
                same_origin=same_origin,
            )
        )
        # In DEV, allow delegation to local uplink server
        if DEV and test:
            # Replace specific target with local version (specific -> do first)
            try:
                result, _meta = call(name, *args, _meta=meta, **kwargs)
                meta.update(_meta)
                return create_response(result)
            except Exception as error:
                log(f"Not using local version of target '{name}'. {str(error)}")
            # Replace all targets with local versions
            try:
                result, _meta = call(
                    "_main",
                    name,
                    args=args,
                    kwargs=kwargs,
                    meta=meta,
                    query=query,
                    **rest,
                )
                meta.update(_meta)
                return create_response(result)
            except Exception as error:
                log(f"Not using local target versions. {str(error)}")
        # Import target module
        try:


            module = __import__(name)
            




        except:
            return create_response(f"Invalid target: {name}.", error=True)
        # Get target


        target = module.__dict__.get(name)




        # Check target
        if not callable(target):
            return create_response(
                f"Target '{name}' does not expose a same-name callable.", error=True
            )
        # Get instance
        if isinstance(target, type):
            if "__init__" in target.__dict__:
                instance = target(meta=meta)
            else:
                instance = target()
                setattr(instance, "meta", meta)
        else:
            instance = target
        # Get result
        try:
            result = instance(*args, **kwargs)
        except:
            return create_response(traceback.format_exc(), error=True)
        # Allow instance to return callable
        if callable(result):
            result = result()
        return create_response(result)


# Register
_main = Main()


@rpc
def main(*args, **kwargs):
    return _main(*args, **kwargs)


http_endpoint(f"/main/:name", methods=["POST"])(_main)
