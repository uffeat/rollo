"""TODO
Consider a more structured approach to using publication meta data.
Works great as-is, but is very much build around the need of the 'blog'
publication/parcel.
- Currently, a '__manifest__.css' file is created for each publication.
  Its content is limited and it's not used... Perhaps purge?
- Currently, a '/data/paths.json' file is created in any same-name parcel
  for each publication. This creates a link between content and assets, so that
  parcels can access meta data super fast by exploiting Vite's json-import ability).
  Powerful stuff and the way to go!... But the data written to the parcels's data dir
  is limited to time-sorted paths. Perhaps the parcel needs other meta data?
  And perhaps the parcel could contain a '.config.json' that tells this builder
  what it needs? Or perhaps the parcel's could contain a "sample" manifest json file
  that serves as instruction re the needed manifest shape? Another approcah could be
  to maintain separate build tools for each publication/parcel combo... More work,
  more complex toolchain, but ultra-fine control. The parcel could even "host" its own
  md src files and contain a "dev-only" Vite app that participates in content building.
"""

import datetime
import json
from pathlib import Path
from bs4 import BeautifulSoup as bs
from frontmatter import Frontmatter
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_emoji import emoji_plugin

from mixins import Files, Minify
from tools import encode, get_timestamp, plural, render


markdown = (
    MarkdownIt("commonmark", {"breaks": True, "html": True})
    .use(front_matter_plugin)
    .use(footnote_plugin)
    .use(emoji_plugin)
    .enable("table")
)

SRC = Path.cwd() / "build_code/content/src"
UTF_8 = "utf-8"

timestamp = get_timestamp()

TIME_FORMAT = "%Y-%m-%d %H:%M"


class build(Files, Minify):

    def __call__(self):
        """."""

        # Mutable to avoid 'global' keyword, when updating.
        count = dict(count=0)

        self.clear("theme/assets/content")

        for publication in SRC.glob("*/"):

            manifest = []

            for file in publication.rglob("**/*.md"):

                # Ignore scratch files
                if " " in file.name or ".draft." in file.name:
                    continue

                path, meta, content = self.create_from_src(file)

                created = meta.get("created")
                manifest.append([f"/{path}", created])

                self.write_css(path, json.dumps(dict(content=content, meta=meta)))

            manifest = sorted(
                manifest,
                key=lambda item: datetime.datetime.strptime(item[1], TIME_FORMAT),
                reverse=True,
            )

            count["count"] += len(manifest)

            def COMMENT():
                """manifest is now date-sorted (newest first) and has the shape:"""
                shape = [["/blog/sprocket", "2025-10-01 10:10"], ...]
                print("manifest:", manifest)

            def NOTE():
                """FYI"""
                is_same = publication.stem == publication.relative_to(SRC).as_posix()
                if is_same:
                    print("Told you so...")

            # Handle publication meta
            self.write_css(f"{publication.stem}/__manifest__", json.dumps(manifest))
            """Check if a corresponding (same-name) publication parcel exists. If it does,
            write time-sorted paths to its data dir."""
            parcel = Path.cwd() / f"_build/assets/assets/parcels/{publication.stem}"
            if parcel.is_dir():
                paths = [
                    path
                    for path, created in manifest
                    if path.startswith(f"/{publication.stem}")
                ]
                self.write(
                    f"build_code/assets/assets/parcels/{publication.stem}/data/paths.json",
                    json.dumps(paths),
                )

        build_no = self.update_build_no()
        print("Build:", build_no)
        count = count["count"]
        message = f"Processed {count} content item{plural(count)}."
        print(message)

    def create_from_src(self, file: Path) -> tuple[str, dict, str]:
        """Returns path, meta data and html content."""
        path: str = file.relative_to(SRC).as_posix()[: -len(".md")]
        entry: dict = Frontmatter.read_file(file)
        meta: dict = entry["attributes"]
        # If meta data does not declare 'created', use file creation timestamp.
        meta["created"] = meta.get(
            "created",
            datetime.datetime.fromtimestamp(file.stat().st_mtime).strftime(TIME_FORMAT),
        )
        content = markdown.render(entry["body"])
        # If template declared in md file, interpolate md-created and meta
        # data into template
        template = meta.pop("template", None)
        if template:
            content = render(
                f"build_code/content/templates/{template}", content=content, **meta
            )
        content = self.minify_html(content)
        return path, meta, content

    def update_build_no(self) -> int:
        """Updates, writes and returns build number."""
        path = "theme/assets/meta/build.json"
        text = self.read(path)
        if text:
            data = json.loads(text)
        else:
            data = {"content": 0}
        previous = data.get("content", 0)
        current = previous + 1
        data["content"] = current
        text = json.dumps(data)
        self.write(path, text)
        return current

    def write_css(self, path: str, content: str) -> None:
        """HACK The transformed content should be CSS, but the applied template is
        HTML with interpolation taking place inside a style tag. The CSS is subsequently
        extracted from the style tag. This slightly extravagent move is simply to provide
        better formatting in the .jinja file."""
        html = self.minify_html(
            render(
                "build_code/content/templates/css.jinja", path=path, content=encode(content)
            )
        )
        soup = bs(html, "html.parser")
        css = soup.select_one("style").string
        self.write(
            f"theme/assets/content/{path}.css",
            f"/*{timestamp}*/\n{css}",
        )


build = build()

if __name__ == "__main__":
    build()
