from data import Data, Effect, Message, State, effect

numbers = State(one=1, two=2).configure(name="numbers")
persons = State(carl=2005, charlotte=1969, hugo=2003).configure(name="persons")

@persons.effect(run=True)
@numbers.effect(run=True)
@effect(count=0, record=Data(numbers=[], persons=[]))
def stuff(effect: Effect, message: Message):
    effect.detail.data.count += 1
    name = message.state.name
    history: list = effect.detail.data.record.data[name]
    history.append(message.change.json())


numbers(two=None)
numbers(three=3)
persons(uffe=1969)

print("Changes to numbers:", stuff.detail.data.record.data.numbers)
print("Changes to persons:", stuff.detail.data.record.data.persons)

print(f"stuff was invoked {stuff.detail.data.count} times")
print(f"stuff reacted to changes in numbers {len(stuff.detail.data.record.data.numbers)} times.")
print(f"stuff reacted to changes in persons {len(stuff.detail.data.record.data.persons)} times.")
