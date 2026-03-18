import json
from datetime import date, datetime
from anvil import BlobMedia
from anvil.server import call
from anvil.tables import Row, SearchIterator
from ._db import db
from ._meta import meta


def _print(*args):
    try:
        print(*args)
    except:
        pass


if meta.DEV:

    class log:
        def __init__(self):

            self._ = {}

        def __call__(self, *args):
            if self._.get("connected") is None:
                try:
                    call("_log")
                    self._["connected"] = True
                except:
                    self._["connected"] = False

            if self._.get("connected") is False:
                _print(*args)
                try:
                    db.log.add_row(data=args)
                except:
                    pass
                return

            args = [self.convert(v) for v in args]

            try:
                call("_log", *args)

            except:
                _print(*args)

        @staticmethod
        def convert(value):
            """."""
            if (
                isinstance(
                    value,
                    (
                        bool,
                        date,
                        datetime,
                        dict,
                        float,
                        int,
                        list,
                        str,
                        tuple,
                        BlobMedia,
                        Row,
                        SearchIterator,
                    ),
                )
                or value is None
            ):
                return value

            try:
                return str(value)
            except:
                pass

            try:
                return json.dumps(value)
            except:
                pass

            return "UNSERIALIZABLE"

    log = log()


else:

    def log(*args):
        _print(*args)
