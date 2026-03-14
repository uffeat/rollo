from anvil import Media
from ._type import type_name


def file_to_text(file) -> str:
    """Returns text content of file (native or media)."""
    if type_name(file) == "File":
        return file.text()

    if isinstance(file, Media):
        return file.get_bytes().decode("utf-8")

    raise TypeError(f"Invalid type (trace: {__file__}).")
