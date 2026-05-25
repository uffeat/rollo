from data import Data, Effect, State, effect

my_state = State(foo=42, bar=8)



@my_state.effect(run=True)
@effect()
def stuff(effect: Effect, **change):
    print("stuff got change:", change)
    print("stuff called by state:", effect.state)
    print("stuff reads index:", effect.index)
    effect.detail.index = effect.index




my_state(bar=None)

print("stuff.detail:", stuff.detail)