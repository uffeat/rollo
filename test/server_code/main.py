import json
from pathlib import Path
from anvil.server import (
    call,
    callable as rpc,
    connect,
    disconnect,
    wait_forever,
)
from tools import Date

UTF_8 = "utf-8"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
    "development"
]["server"]


def main():

    @rpc
    def _main(
        name: str,
        data: dict = None,
        origin: str=None,
        session_id: str=None,
        state: dict=None,
        submission: int = None,
        _type: str = None,
        **rest,
    ):
        """."""
        # Parse data
        if data is None:
            data = {}
        args, kwargs, state = (
            data.pop("args", []),
            data.pop("kwargs", {}),
            data.pop("state", {}),
        )

        # Prepare meta
        meta = dict(
            entry=Date.now()(),
            env='development',
            name=name,
            origin=origin,
            same_origin=True,
            session_id=session_id,
            state=state,
            submission=submission,
            type=_type,
        )

        

        target = __import__(name).__dict__.get(name)
        instance = target(meta=meta)
        result = instance(*args, **kwargs)

        meta.update(dict(exit=Date.now()(), test=True))



        response = dict(result=result, meta=meta)

        return response
       


if __name__ == "__main__":
    ##disconnect()
    connect(KEY)
    main()
    print("Running local server to serve test targets.")
    # HACK For some reason, this script fails at first run (probably an Anvil bug)
    try:
        wait_forever()
    except:
        wait_forever()
