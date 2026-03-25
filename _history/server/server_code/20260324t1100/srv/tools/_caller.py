from types import MappingProxyType
from anvil.server import context


def ip():
    """."""
    caller=context.client
    return caller.ip


def location():
    """."""
    caller = context.client
    if caller.location:
        return dict(
            city=caller.location.city,
            country=caller.location.country,
            latitude=caller.location.latitude,
            longitude=caller.location.longitude,
        )
    return dict()


def caller(context):
    """."""


class Caller:
    """."""