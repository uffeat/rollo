from state import State, Message

state = State(numbers=[1, 2, 3], foo=42)

print("data:", state.data)
print("current:", state.current)
print("previous:", state.previous)
print("change:", state.change)

state()

print("data after clear:", state.data)
print("current after clear:", state.current)
print("previous after clear:", state.previous)
print("change after clear:", state.change)



