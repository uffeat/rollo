"""Utility for building main stylesheet and asset-carrier sheet.

NOTE
- Cannot run, while live-server is running.

TODO
- Do NOT build to parcels
- Perhaps: Clear out dirs
- Perhaps: Mitigate the need for '//' imports
"""

import json
from pathlib import Path
from types import MappingProxyType

from mixins import Files, Minify
from tools import encode, get_config, get_timestamp, plural

SRC = Path.cwd() / "assets"
UTF_8 = "utf-8"

timestamp = get_timestamp()


class build(Files, Minify):
    def __init__(self):
        """Reads config."""
        config = get_config()
        self.origins = MappingProxyType(config["origins"])
        # Extract globals -> Explicitly declared global sheet paths
        self.globals: tuple[str] = tuple(config.get("globals", []))
        # Extract priorities -> Order for global sheet composition
        self.priorities: MappingProxyType = MappingProxyType(
            config.get("priorities", {})
        )

    def __call__(self) -> str:
        """Creates main sheet and asset bundle."""

        messages = []
        messages.append(self.build_main())
        messages.append(self.build_assets())
        message = " ".join(messages)

        return message
    
    @property
    def parcels(self):
        """Returns dir iterator for parcels."""
        # NOTE 'parcels' cannot be reused, therefore return new at each call
        return (Path.cwd() / "parcels").glob("*/")
    
    def build_assets(self) -> str:
        """Builds asset-carrier sheet."""

        rules = []
        paths = []

        for file in SRC.rglob("**/*.*"):
            # Ignore unsupported types
            if file.suffix not in [".css", ".html", ".js", ".json", ".py", ".svg"]:
                continue
            # Ignore meta files
            if file.name.startswith("."):
                continue
            # Ignore test and scratch files
            if " " in file.name or ".test." in file.name:
                continue
            # Read source
            path, text = self.get_src(file)
            # Ignore empty files
            if not text:
                continue
            # Register meta
            paths.append(path)
            # Process
            if file.suffix == ".css":
                # Ignore global sheets
                if f"/{path}" in self.globals:
                    continue
                minified = self.minify_css(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                self.write_raw(path, minified)
                continue
            if file.suffix == ".html":
                text = self.minify_html(text)
                encoded = encode(text)
                rules.append(self.create_asset_rule(path, encoded))
                continue
            if file.suffix == ".js":
                encoded = encode(text)
                rules.append(self.create_asset_rule(path, encoded))
                continue
            if file.suffix == ".json":
                encoded = encode(text)
                rules.append(self.create_asset_rule(path, encoded))
                continue
            if file.suffix == ".py":
                encoded = encode(text)
                rules.append(self.create_asset_rule(path, encoded))
                continue
            if file.suffix == ".svg":
                # Write raw to enable CSS ref
                self.write_raw(path, text)
                minified = self.minify_html(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                continue

        # Meta
        meta = dict(origins=dict(self.origins))
        rules.append(self.create_asset_rule("/__meta__.json", encode(json.dumps(meta))))
        self.write(
            "client/public/meta/paths.json",
            json.dumps(paths),
        )

        # Create css
        css = f"/*{timestamp}*/\n" + self.minify_css("\n".join(rules))
        # Write to client public
        self.write(
            "client/public/assets.css",
            css,
        )
        # Write to parcel test dirs to enable access to assets without commit
        for parcel in self.parcels:
            if (parcel / "test").is_dir():
                file = parcel / "test/assets.css"
                file.write_text(css, encoding=UTF_8)

        # Inform
        count = len(rules)
        message = f"Built {count} asset{plural(count)}."
        print(message)
        return message

    def build_main(self) -> str:
        """Builds main (global) sheet."""
        # Unfreeze globals
        self.globals: list = list(self.globals)
        # Prepare container for holding sheet text
        content = []
        # Get declared globals
        for name in self.globals:
            file: Path = SRC / name
            if not file.is_file():
                raise ValueError(f"Declared global sheet '{name}' not found.")
            text: str = file.read_text(encoding=UTF_8).strip()
            # Ignore empty files
            if not text:
                continue
            priority: int = self.priorities.get(name, 0)
            # Harvest
            content.append([priority, text])

        # Get built parcel sheets.
        """NOTE Vite writes global sheets to same-name dirs. To capture the behavior 
        of the parcel in DEV, such sheets are interpreted as 'global' without
        explicit declaration as such."""
        for parcel in SRC.glob("*/"):
            file: Path = parcel / f"{parcel.name}.css"
            if file.is_file():
                text: str = file.read_text(encoding=UTF_8).strip()
                # Ignore empty files
                if not text:
                    continue
                path = f"{parcel.name}/{parcel.name}.css"
                priority: int = self.priorities.get(path, 0)
                # Guard against double reg
                if path in self.globals:
                    raise ValueError(
                        f"Same-name parcel sheet '{path}' is considered global and should not be explicitly declared as such."
                    )
                # Add to globals to signal to escape asset bundle
                self.globals.append(path)
                # Harvest
                content.append([priority, text])

        # Refreeze globals
        self.globals = tuple(self.globals)

        def COMMENT():
            """Now, content has the shape:"""
            content = [[0, "...css..."], ...]

        content = sorted(content, key=lambda item: item[0], reverse=True)
        content = [item[1] for item in content]

        def COMMENT():
            """Now, content is sorted and has the shape:"""
            content = ["...css...", ...]

        count = len(content)
        # Create css

        css = f"/*{timestamp}*/\n" + self.minify_css("\n".join(content))
        # Write to client public
        self.write(
            "client/public/main.css",
            css,
        )
        # Write to parcel test dirs to enable access to main.css without commit
        for parcel in self.parcels:
            if (parcel / "test").is_dir():
                file = parcel / "test/main.css"
                file.write_text(css, encoding=UTF_8)

        # Inform
        message = f"Aggregated {count} global sheet{plural(count)}."
        print(message)
        return message

    

    def create_asset_rule(self, path: str, encoded: str) -> str:
        """Returns rule text."""
        # NOTE Wrap encoded in "" to prevent formatters from messing up
        return f'[__path__="{path}"] {{\n  --__asset__: "{encoded}";}}'

    @staticmethod
    def get_src(file: Path) -> tuple[str, str]:
        """Returns src asset path and text."""
        return (
            f"/{file.relative_to(SRC).as_posix()}",
            file.read_text(encoding=UTF_8).strip(),
        )

    def write_raw(self, path: str, content: str) -> None:
        """Writes asset to file."""
        self.write(f"client/public/assets/{path}", content)


build = build()

if __name__ == "__main__":
    build()
