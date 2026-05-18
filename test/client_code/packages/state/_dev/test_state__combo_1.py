from state import State, Message



state = State(dict(foo=42))



combo = State()


state.effects.add(combo)



state(foo=43)






