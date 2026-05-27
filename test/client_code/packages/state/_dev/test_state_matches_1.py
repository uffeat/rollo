from data import Data, State

my_state = State(foo=42, bar=8, dong="dong").configure(name="Knud")



@my_state.hook()
def matches(value, other):
    if isinstance(value, str) and isinstance(other, str):
        return value.lower() == other.lower()
    return value == other


my_state.detail.stuff = 42


print("initial:", my_state.current)

my_state(ding=2, foo=42, bar=None, dong="DONG")

print("my_state:", my_state)
print("my_state.current:", my_state.current)
print("my_state.previous:", my_state.previous)
print("my_state.change:", my_state.change)
print("my_state.name:", my_state.name)
print("my_state.detail:", my_state.detail)
print("index:", my_state.index('foo'))
print("foo:", my_state['foo'])

for key, value in my_state:
    print("key:", key)
    print("value:", value)


other = State({'foo': 42, 'dong': 'dong', 'ding': 2})

print("difference:", my_state.difference(other))
print("same:", my_state == other)


