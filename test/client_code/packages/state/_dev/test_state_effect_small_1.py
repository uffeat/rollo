from data import Data, Effect, State, effect

my_state = State(foo=42, bar=8)



@my_state.effect(run=True)
@effect()
def stuff(effect: Effect, **change):
    print("stuff got change:", change)
    print("stuff called by state:", effect.subscriptions.active)
    print("stuff reads index:", effect.subscriptions.active.effects.active.index)
    effect.detail.index = effect.subscriptions.active.effects.active.index




my_state(bar=None)

print("stuff.detail:", stuff.detail)