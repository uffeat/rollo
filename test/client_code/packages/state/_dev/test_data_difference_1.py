from state import Data, Ref, State, Message, instantiate

data = Data(foo=42, bar=8, ping=5)
other = dict(foo=42, ping=7)

# Stuff in other that is not in data
difference = data.difference(other)
print("difference", difference)
print("difference", other - data)

# Stuff in data that is not in other
flipped = data.difference(other, flip=True)
print("flipped", flipped)
print("flipped", data - other)
