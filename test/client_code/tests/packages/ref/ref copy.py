"""
packages/ref/ref.py
"""


def main(use, *args, **kwargs):
    

    anvil, app, console, document, js, log, meta, native, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )

    Ref = use("@@/ref", test=True).Ref
    ##effect_for = use("@@/ref", test=True).effect_for

   

    state = Ref(42)
    
    log('current', state.current, trace='main')
    log('previous', state.previous, trace='main')

    @state.effect(lambda current: current == 42, run=True)
    def only_42(current):
        log('current', current, trace='only_42')

    @state.effect(once=True)
    def once_effect(current):
        log('current', current, trace='once_effect')

    ##@effect_for(state)
    def catch_all(current):
        log('current', current, trace='catch_all')

    state(43)
    state(42)
    state(43)
    state(42)
    state(dict(value=42))
    state(dict(value=42))

  