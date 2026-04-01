from ..tools import Query


def is_part(k: str) -> bool:
    """Tests if k is path part precursor."""
    return k.startswith("_") and len(k) == 2 and k[1:].isdigit()


def parse(start: str, query: dict) -> tuple:
    """Returns parsed incoming query."""
    paths = [v for k, v in query.items() if is_part(k)]
    return (
        paths[0] if paths else start,
        f"/{'/'.join(paths)}",
        {k: Query.cast(v) for k, v in query.items() if not is_part(k)},
    )
