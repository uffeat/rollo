import json
from pathlib import Path
from anvil.server import (
    callable as rpc,
    connect,
    wait_forever,
)


UTF_8 = "utf-8"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
    "development"
]["server"]


def main():

    @rpc
    def _main(
        name: str,
        args: list = None,
        kwargs: dict = None,
        meta: dict = None,
        **rest,
    ):
        """."""
        # Import target module
        module = __import__(name)

        # Get target
        target = module.__dict__.get(name)

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
        result = instance(*args, **kwargs)
        return result, meta


if __name__ == "__main__":
    connect(KEY)
    main()
    print("Running local server to serve targets.")
    # HACK For some reason, this script fails at first run (probably an Anvil bug)
    try:
        wait_forever()
    except:
        wait_forever()
