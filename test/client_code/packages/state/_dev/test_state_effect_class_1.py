from data import Data, Effect, Message, State

my_state = State(foo=42, bar=8)


my_effect = Effect()

@my_effect.condition()
def condition(effect: Effect, message: Message):
    print("condition got message:", message)
    return 'foo' in message

@my_effect.source()
def stuff(effect: Effect, message: Message):
    print("stuff got message:", message)
    print("stuff called by state:", effect.subscriptions.active)
    print("stuff reads index:", effect.subscriptions.active.effects.active.index)


my_state.effects.add(my_effect, run=True)
##my_effect.subscriptions.add(my_state, run=True)

my_state(bar=None)


##print('registry:', my_state.effects._['registry'])




print('has:', my_effect in my_state.effects)

print('index:', my_state.effects.index(my_effect))