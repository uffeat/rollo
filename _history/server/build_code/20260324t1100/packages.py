from pathlib import Path
from mixins import Files
from tools import get_timestamp, plural


UTF_8 = "utf-8"

timestamp = get_timestamp()


class build(Files):

    def __call__(self) -> None:
        """Builds file with top-level package loaders."""

        names = [
            d.stem
            for d in (Path.cwd() / "client_code").iterdir()
            if d.is_dir()
            if not d.stem.startswith("_")
            and d.stem not in ["main", "iworker", "test", "use"]
            and " " not in d.name
        ]

        text = ""
        for name in names:
            _text = f"""
def {name}():
  from ... import {name}

  return {name}
"""
            text += _text

        # Create loaders file
        self.write(
            "client_code/use/_packages/_loaders.py",
            f"#  Generated: {timestamp}\n{text.strip()}",
        )
        
        count = len(names)
        print(f"Built {count} loader{plural(count)}.")


build = build()

if __name__ == "__main__":
    build()
