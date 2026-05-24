from data import State

state = State(foo=42, bar=8, dong="dong").config(name="Knud")


@state.capability()
def match(value, other):
    if isinstance(value, str) and isinstance(other, str):
        return value.lower() == other.lower()
    return value == other


state.detail.stuff = 42


print("initial:", state.current)

state(ding=2, foo=42, bar=None, dong="DONG")


print("state.current:", state.current)
print("state.previous:", state.previous)
print("state.change:", state.change)

print("state.name:", state.name)

print("state.detail:", state.detail)
