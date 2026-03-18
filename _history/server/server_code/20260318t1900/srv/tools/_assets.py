from anvil import BlobMedia, URLMedia
from ._meta import meta


def get_asset(path: str) -> BlobMedia:
    """Returns asset as blob."""
    return URLMedia(f"{meta.origin}/_/theme/{path}")


def get_asset_text(path: str) -> str:
    """Returns asset as text."""
    media: BlobMedia = URLMedia(f"{meta.origin}/_/theme/{path}")
    text: str = media.get_bytes().decode("utf-8")
    return text
