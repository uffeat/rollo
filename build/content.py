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

SRC = Path.cwd() / "client/public/content/src"
DIST = "client/public/content/built"
UTF_8 = "utf-8"

timestamp = get_timestamp()

TIME_FORMAT = "%Y-%m-%d %H:%M"


class build(Files, Minify):

    def __call__(self):
        """."""
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

            

            # Handle publication meta
            self.write(f"client/public/content/meta/{publication.stem}.json", json.dumps(manifest))
            

       
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

            ##
            ##
            content = render(
                f"build_code/content/templates/{template}", content=content, **meta
            )
        content = self.minify_html(content)
        return path, meta, content

    

    def write_json(self, content=None, meta=None, path=None) -> None:
        """Writes transpiled result to json."""
        self.write(
            f"{DIST}/{path}.json",
            json.dumps(dict(html=content, meta=meta))
        )

    
    
    


build = build()

if __name__ == "__main__":
    build()
