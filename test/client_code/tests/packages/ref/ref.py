"""
packages/ref/ref.py
"""


def main(use, *args, **kwargs):
    

    use("@@/assets/")
    anvil, app, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.packages,
        use.tools,
        use.window,
    )

    
    _Ref = use("@/rollo/").Ref
    

    Ref = use("@@/ref", test=False).Ref
    
    

    state = Ref(_Ref.create(42))
    
    log('current', state.current, trace='main')
    log('previous', state.previous, trace='main')

    @state.effect(lambda current: current == 42, run=True)
    def only_42(current):
        log('current', current, trace='only_42')

    @state.effect(once=True)
    def once_effect(current):
        log('current', current, trace='once_effect')

    


    state(43)
    state(42)
    state(43)
    state(42)
    state(dict(value=42))
    state(dict(value=42))

  
