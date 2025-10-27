import json
from pathlib import Path

UTF_8 = "utf-8"


def get_config() -> dict:
    """Returns config."""
    return json.loads((Path.cwd() / "build/build.config.json").read_text(encoding=UTF_8))
