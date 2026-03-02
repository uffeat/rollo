import base64
import json
from anvil import BlobMedia
from .tools import Api, Result, db, api, parse_data_url

UTF_8 = "utf-8"


@api()
class pilot(Api):
    """XXX For testing file upload."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, file=None):
        if hasattr(file, "get_bytes"):
            # Got blob likely from server function or same-origin http
            db.pilot.add_row(media=file)
            return Result(message="Saved to db.")

        if isinstance(file, str):
            # Got text, likely from http; extract dto
            file: dict = json.loads(file)

        if isinstance(file, dict):
            # Got dto, likely from http; save dto, construct and save blob
            row = db.pilot.add_row(simple=file)
            encoding = file.pop("encoding")
            content: str = file.pop("content")
            content = content.strip()  # Important to do this!
            content_type = file.pop("content_type")
            name = file.pop("name", None)

            if encoding == "dataURL":
                content = parse_data_url(content)
                content = base64.b64decode(content)
                file = BlobMedia(content_type, content, name=name)
                row["media"] = file

            elif encoding == "text":
                content = content.encode(UTF_8)
                file = BlobMedia(content_type, content, name=name)
                row["media"] = file

            elif encoding == "base64":
                content = base64.b64decode(content)
                file = BlobMedia(content_type, content, name=name)
                row["media"] = file

        else:
            raise TypeError(f"Could not handle: {str(file)}")

        return Result(message="Saved to db.")
