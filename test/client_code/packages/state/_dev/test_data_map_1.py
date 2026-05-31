from data import Data

test = Data(one=1, two=2, three=3)


@test.map(mutate=True)
def double(key, value, data: Data = None, index: int = None):
    return key, 2 * value


print("mapped:", double())

print("test:", test)
