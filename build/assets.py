import json
from pathlib import Path

from mixins import Files, Minify
from tools import encode, get_timestamp, plural


SRC = Path.cwd() / "client/public/parcels"
UTF_8 = "utf-8"

timestamp = get_timestamp()


class main(Files, Minify):
    """Utility for building main sheet with styles and encoded assets."""

    def __call__(self):
        paths = []
        rules = []
        style_rules = []

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
                minified = self.minify_css(text)
                if file.stem == file.parent.stem:
                    # NOTE Already minified from parcel
                    style_rules.append(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                continue
            if file.suffix == ".html":
                minified = self.minify_html(text)
                encoded = encode(minified)
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
                minified = self.minify_html(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                continue
            if file.suffix == ".template":
                minified = self.minify_html(text)
                encoded = encode(minified)
                rules.append(self.create_asset_rule(path, encoded))
                continue

        # Meta

        ## paths
        paths = json.dumps(paths)
        rules.append(self.create_asset_rule("/__paths__.json", encode(paths)))
        self.write(
            "client/public/parcels/meta/paths.json",
            paths,
        )

        # Create css
        css = (
            f"/*{timestamp}*/\n"
            + self.minify_css("\n".join(rules))
            + "\n".join(style_rules)
        )
        # Write main sheet
        self.write(
            "client/src/main.css",
            css,
        )
        # For Anvil import
        self.write(
            "client/public/anvil/main.css",
            css,
        )
        asset_css = (
            f"/*{timestamp}*/\n"
            + self.minify_css("\n".join(rules))
        )
        style_css = (
            f"/*{timestamp}*/\n"
            + "\n".join(style_rules)
        )
        self.write(
            "client/public/anvil/assets.css",
            asset_css,
        )
        self.write(
            "client/public/anvil/styles.css",
            style_css,
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


main = main()

if __name__ == "__main__":
    main()
