"""
state/ref.py
"""


def main(use, *args, **kwargs):
    """."""

    anvil, console, document, js, log, meta, native, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    component = use("@@/component/")

    
    _Ref = use("@/rollo/").Ref


    class Ref:
        """Python adaptation of rollo Ref."""
        def __init__(self, current=None, **options):
            ref = _Ref.create(current, options)
            self._ = dict(ref=ref)

            class effect:
                def __init__(self, *args):
                    self.args = args

                def __call__(self, handler):
                    ref.effects.add(handler, *self.args)
                    return handler

            self._["effect"] = effect

        def __call__(self, current=None):
            self._["ref"].update(current)
            return self

        def __getattr__(self, key: str):
            """."""
            return self[key]

        def __getitem__(self, key: str):
            """."""
            return self._["ref"][key]

        @property
        def effect(self):
            """."""
            return self._["effect"]
        
        @property
        def ref(self):
            """."""
            return self._["ref"]


        

