from anvil import BlobMedia, URLMedia
from anvil.server import get_app_origin


def get_asset(path: str) -> BlobMedia:
    """Returns asset as blob."""
    return URLMedia(f"{get_app_origin()}/_/theme/{path}")


def get_asset_text(path: str) -> str:
    """Returns asset as text."""
    media: BlobMedia = URLMedia(f"{get_app_origin()}/_/theme/{path}")
    text: str = media.get_bytes().decode("utf-8")
    return text
