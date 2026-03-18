from anvil.server import call
from ._meta import meta


if meta.DEV:

    class log:
        def __init__(self):

            self._ = {}

        def __call__(self, *args):

            print(*args)

            if self._.get("connected"):
                call("_log", *args)
                return

            if self._.get("connected") is False:
                return

            try:
                call("_log", *args)
                self._["connected"] = True
            except:
                self._["connected"] = False

    log = log()


else:

    def log(*args):
        print(*args)
