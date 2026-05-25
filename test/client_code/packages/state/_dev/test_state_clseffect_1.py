from data import Data, State, state

main = State(foo=42, bar=8)


effect = State()

main.effects.add(effect)

