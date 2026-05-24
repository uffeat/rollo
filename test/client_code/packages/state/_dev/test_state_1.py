from data import Data, State

state = State(foo=42, bar=8)



@state.effect("foo", dict(ding=2), run=True)
def effect(**change):
    print("effect reads session:", state.session)
    print("effect reads index:", state.effects.index)
    print("effect got change:", change)


@state.effect(lambda **change: 'ping' in change)
def effect(**change):
    print("ping effect got change:", change)


##state.effects.clear()


state(bar=None)


state(ding=2, foo=42)
state(foo=43)
state(ping=1)


