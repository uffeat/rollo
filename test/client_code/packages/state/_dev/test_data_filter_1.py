from data import Data

test = Data(first=10, second=20, third=30)


@test.filter(mutate=True)
def max_20(key, value, data: Data = None, index: int = None):
    return value <= 20


print("filtered:", max_20())

print("test:", test)
