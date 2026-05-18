from state import Data, Ref, State, Message, instantiate

data_1 = Data(foo=42).config()


print("data_1:", data_1)

data_2 = data_1.clone()

data_1(bar=8)
print("data_1:", data_1)
print("data_2:", data_2)


