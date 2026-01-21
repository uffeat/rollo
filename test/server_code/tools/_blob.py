import json
from anvil import BlobMedia


class Blob:
    def __init__(self, encoding=None, content=None, content_type: str = "", name: str = None, **kwargs):
        if hasattr(content, "get_bytes"):
            self._blob = content
        else:
            if not isinstance(content, str):
                content = json.dumps(content)
            content = content.encode("utf-8")
            self._blob = BlobMedia(content_type, content, name=name)

    @property
    def blob(self):
        return self._blob

    @property
    def name(self):
        return self._blob.name

    @property
    def type(self):
        return self._blob.content_type

    @property
    def url(self):
        return self._blob.url

    def read(self):
        """Returns decoded and possibly parsed blob content."""
        text = self._blob.get_bytes().decode("utf-8")
        try:
            return json.loads(text)
        except:
            return text
