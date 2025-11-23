"""Utility for building main stylesheet and asset-carrier sheet."""

"""TODO
- Get public paths and write to public and assets
"""

import json
from pathlib import Path


from mixins import Files, Minify
from tools import encode, get_timestamp, plural
from config import config

SRC = Path.cwd() / "client/assets"
UTF_8 = "utf-8"

timestamp = get_timestamp()


class build(Files, Minify):
    def __init__(self):
        """."""

    def __call__(self):
        """Creates main sheet and asset bundle."""
        self.build_assets()
        self.build_main()

    @property
    def parcels(self):
        """Returns dir iterator for parcels."""
        # NOTE 'parcels' cannot be reused, therefore return new at each call
        return (Path.cwd() / "parcels").glob("*/")

    def build_assets(self):
        """Builds asset-carrier sheet."""
        

        _config: dict = config()
        main: tuple = _config.get("main", tuple())
        private: tuple = _config.get("private", tuple())

        paths = []
        rules = []

        for file in SRC.rglob("**/*.*"):
            # Ignore unsupported types
            if file.suffix not in [
                ".css",
                ".html",
                ".js",
                ".json",
                ".py",
                ".svg",
                ".template",
            ]:
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
                if path in main:
                    continue
                minified = self.minify_css(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                """NOTE
                - Writing to public enables css use by link.
                """
                if path not in private:
                    self.write_public(path, minified)
                continue
            if file.suffix == ".html":
                minified = self.minify_html(minified)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                if path not in private:
                    self.write_public(path, minified)
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
                minified = self.minify_html(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                """NOTE
                - Writing to public enables svg use by css ref.
                - Write unminified to enable icon display in editor.
                """
                if path not in private:
                    self.write_public(path, text)
                continue
            if file.suffix == ".template":
                minified = self.minify_html(minified)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                if path not in private:
                    self.write_public(path, minified)
                continue

        # Meta
        ## content paths
        CONTENT = Path.cwd() / "client/public/content"
        content_paths = [
            f"/{f.relative_to(CONTENT).as_posix()}"
            for f in CONTENT.rglob("**/*.*")
            if f.parent.name != "meta"
        ]
        content_paths = json.dumps(content_paths)
        rules.append(self.create_asset_rule("/__content_paths__.json", encode(content_paths)))
        self.write(
            "client/public/content/meta/paths.json",
            content_paths,
        )

        ## data paths
        DATA = Path.cwd() / "client/public/data"
        data_paths = [
            f"/{f.relative_to(DATA).as_posix()}"
            for f in DATA.rglob("**/*.*")
            if f.parent.name != "meta"
        ]
        data_paths = json.dumps(data_paths)
        rules.append(self.create_asset_rule("/__data_paths__.json", encode(data_paths)))
        self.write(
            "client/public/data/meta/paths.json",
            data_paths,
        )



        ## paths
        paths = json.dumps(paths)
        rules.append(self.create_asset_rule("/__paths__.json", encode(paths)))
        self.write(
            "client/public/assets/meta/paths.json",
            paths,
        )
        ## server
        server = json.dumps(_config.get("server", {}))
        rules.append(self.create_asset_rule("/__server__.json", encode(server)))
        self.write("client/public/assets/meta/server.json", server)

        # Create css
        css = f"/*{timestamp}*/\n" + self.minify_css("\n".join(rules))
        # Write to client public
        self.write(
            "client/public/assets.css",
            css,
        )

        # Inform
        count = len(rules)
        message = f"Built {count} asset{plural(count)}."
        print(message)

    def build_main(self):
        """Builds main (global) sheet."""
        _config: dict = config()
        main: list = list(_config.get("main", tuple()))
        priorities: dict = _config.get("priorities", {})

        # Prepare container for holding sheet text
        content = []
        # Get declared globals
        for name in main:
            file: Path = SRC / name[1:]
            if not file.is_file():
                raise ValueError(f"Declared global sheet '{name}' not found.")
            text: str = file.read_text(encoding=UTF_8).strip()
            # Ignore empty files
            if not text:
                continue
            priority: int = priorities.get(name, 0)
            # Harvest
            content.append([priority, text])

        # Get built parcel sheets.
        """NOTE Vite writes global sheets to same-name dirs. Such sheets are 
        interpreted as 'main' without explicit declaration."""
        for parcel in SRC.glob("*/"):
            file: Path = parcel / f"{parcel.name}.css"
            if file.is_file():
                text: str = file.read_text(encoding=UTF_8).strip()
                # Ignore empty files
                if not text:
                    continue
                path = f"/{parcel.name}/{parcel.name}.css"
                priority: int = priorities.get(path, 0)
                # Guard against double reg
                if path in main:
                    raise ValueError(
                        f"Same-name parcel sheet '{path}' is considered global and should not be explicitly declared as such."
                    )
                # Add to globals to signal to escape asset bundle
                main.append(path)
                # Harvest
                content.append([priority, text])

        def COMMENT():
            """Now, content has the shape:"""
            content = [[0, "...css..."], ...]

        content = sorted(content, key=lambda item: item[0])
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
        # Inform
        message = f"Aggregated {count} global sheet{plural(count)}."
        print(message)

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

    def write_public(self, path: str, content: str) -> None:
        """Writes asset to file."""
        self.write(f"client/public/assets/{path}", content)


build = build()

if __name__ == "__main__":
    build()
