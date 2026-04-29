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

    ref = use("@@/ref/", test=True)

    log('ref:', ref, trace='main')

    state = ref(42)
    
    log('current', state.current, trace='main')
    log('previous', state.previous, trace='main')

    @state.effect(lambda current: current == 42, run=True, once=True)
    def effect(current, *args):
        log('current', current, trace='effect')

    state(43)
    state(42)
    state(43)
    state(42)

  