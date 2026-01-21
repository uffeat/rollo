from urllib.parse import unquote as _decode


def decode_url_dict(encoded: dict) -> dict:
    """Returns an url-decoded interpretation of 'encoded'."""
    decoded = {_decode(key): _decode(value) for key, value in encoded.items()}
    return decoded
