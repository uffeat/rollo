from state import Data, Ref, State, Message, instantiate

data = Data(foo=42, bar=None).config()

print("data:", data)


@data.match()
def match(value, other):
    """."""
    return str(value) == str(other)


other = dict(foo='42', bar=None)

difference = data.difference(other)

print("difference", difference)
