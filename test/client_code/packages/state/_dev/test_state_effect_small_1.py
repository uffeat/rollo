from data import Data, Effect, Message, State, effect

numbers = State(one=1, two=2).configure(name='numbers')

persons = State(carl=True, charlotte=True, hugo=True).configure(name='persons')


@persons.effect(run=True)
@numbers.effect(run=True)
@effect(count=0)
def stuff(effect: Effect, message: Message):
    effect.detail.count += 1
    print("effect.detail.count:", effect.detail.count)
    




    name = message.state.name
    print("stuff reacts to changes in:", name)
    print("stuff got changes:", message)
    print(' ')
    ##effect.detail.index = effect.subscriptions.active.effects.active.index




numbers(two=None)

print("stuff.detail:", stuff.detail)