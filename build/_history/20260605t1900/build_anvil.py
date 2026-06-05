import json
from pathlib import Path
from time import sleep

from anvil import BlobMedia
from anvil.tables import app_tables
from anvil.server import callable as server_function

from mixins import Files, Minify
from tools import Connection, connect, disconnect, encode, get_timestamp, plural

SOURCE = Path.cwd() / "anvil"
UTF_8 = "utf-8"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
    "development"
]["server"]
TYPES = (".css", ".html", ".js", ".json", ".py", ".svg", ".template")

timestamp = get_timestamp()


class main(Files, Minify):
    """."""

    def __call__(self):
        """."""
        content = {}

        for file in SOURCE.rglob("**/*.*"):
            # Ignore unsupported types
            if file.suffix not in TYPES:
                continue

            # Read source
            path, text = self.get_src(file)

            ##print("path:", path)  ##
            ##print("text:", text)  ##

            # Process
            content[path] = text

        print("content:", content)  ##
        count = len(content)
        message = f"Processed {count} file{plural(count)}."

        content = json.dumps(content)
        content = content.encode(UTF_8)

        media = BlobMedia("code", content, name="code")
        ##print("media:", media)  ##


        ##disconnect()
        connect()
        
        row = app_tables.meta.get(key="code")
        ##print("row:", row)  ##
        if row:
            row.update(media=media)
        else:
            app_tables.meta.add_row(key="code", media=media)


        state = dict(used=False)

        

        keep = connect()
        
        row = app_tables.meta.get(key="code")
        ##print("row:", row)  ##
        if row:
            row.update(media=media)
        else:
            app_tables.meta.add_row(key="code", media=media)

        @server_function
        def _get_code() -> BlobMedia:
            """."""
            return media

        keep(message)

            
            


       


            
            

        print('Do I get to here?')

        

    
    
    @staticmethod
    def get_src(file: Path) -> tuple[str, str]:
        """Returns src asset path and text."""
        return (
            f"/{file.relative_to(SOURCE).as_posix()}",
            file.read_text(encoding=UTF_8).strip(),
        )


main = main()

if __name__ == "__main__":
    main()
