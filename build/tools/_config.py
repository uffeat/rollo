import json
from pathlib import Path

UTF_8 = "utf-8"


def get_config() -> dict:
    """Returns config."""
    return json.loads((Path.cwd() / "build_code/config.json").read_text(encoding=UTF_8))
