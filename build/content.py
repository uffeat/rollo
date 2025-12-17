import datetime
import json
from pathlib import Path
from frontmatter import Frontmatter
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin
from mdit_py_plugins.footnote import footnote_plugin
from mdit_py_emoji import emoji_plugin

from mixins import Files, Minify
from tools import get_timestamp, plural, render


markdown = (
    MarkdownIt("commonmark", {"breaks": True, "html": True})
    .use(front_matter_plugin)
    .use(footnote_plugin)
    .use(emoji_plugin)
    .enable("table")
)

SRC = Path.cwd() / "client/public/content"
DIST = "client/public/parcels/content"
UTF_8 = "utf-8"

timestamp = get_timestamp()

TIME_FORMAT = "%Y-%m-%d %H:%M"


class main(Files, Minify):

    def __call__(self):
        """Utility for transpiling MD (pure and Frontmatter-style) to JSON.
        Creates manifest for each publication.
        NOTE
        - Reads from `/public/content`, from where runtime transpilation is 
          possible. 
        - Writes to `/public/parcels/content`. From there, transpiled JSON 
          (incl. manifest) can be read directly at runtime. However, this is also
          the src for the `assets` build tool, which injects into the main sheet
          for super-fast retrieval. """
        # HACK File and dir deletion can be finicky... therefore try-except
        try:
            self.clear(DIST)
        except Exception as error:
            print(f"Clearing of '{DIST}' failed. Error:", error)

        # Mutable to avoid 'global' keyword, when updating.
        count = dict(count=0)

        for publication in SRC.glob("*/"):
            manifest = []
            for file in publication.rglob("**/*.md"):
                # Ignore meta files
                if file.name.startswith("."):
                    continue
                # Ignore draft and scratch files
                if " " in file.name or ".draft." in file.name:
                    continue
                path, meta, content = self.create_from_src(file)
                self.write_json(content=content, meta=meta, path=path)
                created = meta.get("created")
                manifest.append([f"/{path}", created])
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

            # Handle manifest
            self.write(
                f"client/public/parcels/content/{publication.stem}/_manifest.json",
                json.dumps(manifest),
            )

        count = count["count"]
        message = f"Processed {count} content item{plural(count)}."
        print(message)

    def create_from_src(self, file: Path) -> tuple[str, dict, str]:
        """Returns path, meta data and html content."""
        path: str = file.relative_to(SRC).as_posix()[: -len(".md")]
        entry: dict = Frontmatter.read_file(file)
        meta: dict = entry["attributes"]

        if not entry["body"]:
            """NOTE No body -> Pure MD
            - meta as empty dict -> triggers 'created' processing
            - reload text from file and inject into entry as 'body'
            """
            meta = {}
            text = file.read_text(encoding=UTF_8)
            entry["body"] = text
            entry.pop("frontmatter", None)

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
            # XXX Do NOT minify Jinja-rendered templates!
            meta["html"] = render(f"client/templates{template}", **meta)
        content = self.minify_html(content)
        return path, meta, content

    def write_json(self, content=None, meta=None, path=None) -> None:
        """Writes transpiled result to json."""
        self.write(f"{DIST}/{path}.json", json.dumps(dict(html=content, meta=meta)))


main = main()

if __name__ == "__main__":
    main()
