from state import Data, Ref, State, Message, instantiate

data = Data(foo=42).config()


print("data:", data)

