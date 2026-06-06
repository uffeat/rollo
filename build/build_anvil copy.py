import json
from pathlib import Path


from anvil import BlobMedia
from anvil.server import callable as server_function
from anvil.tables import app_tables


from mixins import Files, Minify
from tools import Blob, Connection, connect, encode, get_timestamp, plural

SOURCE = Path.cwd() / "anvil"
UTF_8 = "utf-8"
KEY = (json.loads((Path.cwd() / "secrets.json").read_text(encoding=UTF_8)))[
    "development"
]["server"]
TYPES = (".css", ".html", ".js", ".json", ".py", ".svg", ".template")

timestamp = get_timestamp()


class main:
    """."""

    def __call__(self):
        """."""
        code = {}
        meta = {}

        for file in SOURCE.rglob("**/*.*"):
            # Ignore unsupported types
            if file.suffix not in TYPES:
                continue

            ##print("parts:", file.parts)  ##
            if 'test' in file.parts:
                continue


          
            

           
            

            
            
            # Read source
            path, text = self.get_src(file)

            ##print("path:", path)  ##
            ##print("text:", text)  ##

            # Process
            code[path] = text

        
        print("code:", code)  ##
        count = len(code)
        message = f"Serving code with {count} file{plural(count)}."

        

        code = Blob(code, content_type="code", name="code")

        with Connection(message=message):
            row = app_tables.meta.get(key="code")
            ##print("row:", row)  ##
            if row:
                row.update(media=code)
            else:
                app_tables.meta.add_row(key="code", media=code)

            @server_function
            def _get_code() -> BlobMedia:
                """."""
                return code

    @staticmethod
    def get_src(file: Path) -> tuple[str, str]:
        """Returns src asset path and text."""
        return (
            f"/{file.relative_to(SOURCE).as_posix()}",
            file.read_text(encoding=UTF_8).strip(),
        )
    
    @staticmethod
    def save(code: BlobMedia) -> None:
        """."""
        row = app_tables.meta.get(key="code")
        ##print("row:", row)  ##
        if row:
            row.update(media=code)
        else:
            app_tables.meta.add_row(key="code", media=code)
        


main = main()

if __name__ == "__main__":
    main()
