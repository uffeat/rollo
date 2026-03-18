import json
import traceback
from types import MappingProxyType
from anvil.server import context, request
from ..tools import Date, Response, access, api, log, meta
from ._test import test


class Base:

    def __init__(self, **public):
        self.__ = dict(
            private=dict(
                caller=context.client,
                context=context.type,
                # context.remote_caller.type: browser, server_module or uplink
                type=dict(http="api", browser="rpc").get(context.remote_caller.type),
            ),
            public=dict(public=public),
        )

    @property
    def _(self) -> dict:
        return self.__["public"]

    def __getitem__(self, key: str):
        return self._.get(key)

    def __getattr__(self, key: str):
        return self._[key]

    @property
    def caller(self) -> MappingProxyType:
        """."""
        caller = self.__["private"]["caller"]
        return MappingProxyType(
            dict(
                ip=caller.ip,
                location=MappingProxyType(
                    dict(
                        city=caller.location.city,
                        country=caller.location.country,
                        latitude=caller.location.latitude,
                        longitude=caller.location.longitude,
                    )
                    if caller.location
                    else dict()
                ),
            )
        )

    @property
    def context(self) -> str:
        """."""
        return self.__["private"]["context"]

    @property
    def type(self) -> str:
        """."""
        return self.__["private"]["type"]
