"""
packages/reactive/reactive.py
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

    _Reactive = use("@/rollo/").Reactive

    Reactive = use("@@/reactive", test=True).Reactive
    effect = use("@@/reactive", test=True).effect

    state = Reactive(_Reactive.create())

    @state.effect(run=True)
    def _effect(**changes):
        log("changes", changes, trace="_effect")

    @state.effect("foo")
    def _only_foo(**changes):
        log("changes", changes, trace="_only_foo")

    @state.effect("foo", once=True)
    def _once(**changes):
        log("changes", changes, trace="_once")

    state(foo="FOO")
    state(foo="FOO")
    state(bar="BAR")
    state(foo=8)

    log("current", state.current, trace="main")
    log("previous", state.previous, trace="main")
    log("change", state.change, trace="main")

    log("number", state.number, trace="main")
    log("noexist", state.noexist, trace="main")
