import json
from datetime import date, datetime
from anvil import BlobMedia
from anvil.server import call
from anvil.tables import Row, SearchIterator, app_tables
from ._meta import meta


if meta.DEV:

    def log(*args):
        try:
            call("_log", *args)
        except:
            try:
                print(*args)
            except:
                pass
            try:
                app_tables.log.add_row(data=args)
            except:
                pass

else:

    def log(*args):
        print(*args)
