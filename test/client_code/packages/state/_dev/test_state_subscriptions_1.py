from data import Data, Effect, State

my_state = State(foo=42, bar=8)


my_effect = Effect()

@my_effect.source()
def stuff(effect: Effect, **change):
    print("stuff got change:", change)
    print("stuff called by state:", effect.state)
    print("stuff reads index:", effect.index)


my_effect.subscriptions.add(my_state, run=True)


my_state(bar=None)

##my_effect.subscriptions.clear()
##my_state.effects.clear()
my_state.effects.remove(my_effect)

print("effects:", len(my_state.effects))
print("effects:", len(my_effect.subscriptions))



my_state(ding=2)