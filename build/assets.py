"""Utility for building asset-carrier sheet."""

import json
from pathlib import Path

from mixins import Files, Minify
from tools import encode, get_timestamp, plural


SRC = Path.cwd() / "client/assets"
UTF_8 = "utf-8"

timestamp = get_timestamp()


class build(Files, Minify):

    def __call__(self):
        paths = []
        rules = []

        for file in SRC.rglob("**/*.*"):
            # Ignore unsupported types
            if file.suffix not in [
                ".css",
                ".html",
                ".js",
                ".json",
                ".svg",
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
                minified = self.minify_css(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                """NOTE
                - Writing to public enables css use by link.
                """
                self.write_public(path, minified)
                continue
            if file.suffix == ".html":
                minified = self.minify_html(minified)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                self.write_public(path, minified)
                continue
            if file.suffix == ".js":
                encoded = encode(text)
                rules.append(self.create_asset_rule(path, encoded))
                ##self.write_public(path, text)
                continue
            if file.suffix == ".json":
                encoded = encode(text)
                rules.append(self.create_asset_rule(path, encoded))
                self.write_public(path, text)
                continue
            if file.suffix == ".svg":
                minified = self.minify_html(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                """NOTE
                - Writing to public enables svg use by css ref.
                - Write unminified to enable icon display in editor.
                """
                self.write_public(path, text)
                continue

        # Meta

        ## paths
        paths = json.dumps(paths)
        rules.append(self.create_asset_rule("/__paths__.json", encode(paths)))
        self.write(
            "client/public/assets/meta/paths.json",
            paths,
        )

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
