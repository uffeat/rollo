from data import Data, State

state = State(foo=42, bar=8, dong="dong").config(name="Knud")



@state.capability()
def matches(value, other):
    if isinstance(value, str) and isinstance(other, str):
        return value.lower() == other.lower()
    return value == other


state.detail.stuff = 42


print("initial:", state.current)

state(ding=2, foo=42, bar=None, dong="DONG")

print("state:", state)
print("state.current:", state.current)
print("state.previous:", state.previous)
print("state.change:", state.change)
print("state.name:", state.name)
print("state.detail:", state.detail)
print("index:", state.index('foo'))
print("foo:", state['foo'])

for key, value in state:
    print("key:", key)
    print("value:", value)


other = State({'foo': 42, 'dong': 'dong', 'ding': 2})

print("difference:", state.difference(other))
print("same:", state == other)


