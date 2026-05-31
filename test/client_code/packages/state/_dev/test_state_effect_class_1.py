from data import Data, Effect, Message, State

numbers = State(one=1, two=2).configure(name="numbers")
persons = State(carl=2005, charlotte=1969, hugo=2003).configure(name="persons")


my_effect = Effect()


@my_effect.source()
def stuff(effect: Effect, message: Message):
    print("stuff got message:", message)
    

##my_state.effects.add(my_effect, run=True)
my_effect.subscriptions.add(numbers, run=True, protected=True)

numbers(two=None)


my_effect.subscriptions.clear()






numbers(three=3)
persons(uffe=1969)


##print('registry:', my_state.effects._['registry'])




print('has:', my_effect in numbers.effects)
print('has:', numbers in my_effect.subscriptions)

print('index:', numbers.effects.index(my_effect))