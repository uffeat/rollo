from data import Data, Effect, State

my_state = State(foo=42, bar=8)


my_effect = Effect()

@my_effect.source()
def stuff(effect: Effect, **change):
    print("stuff got change:", change)
    print("stuff called by state:", effect.state)
    print("stuff reads index:", effect.index)


my_state.effects.add(my_effect, run=True)

my_state(bar=None)