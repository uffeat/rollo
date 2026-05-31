from data import Data

test = Data(first=10, second=20, third=30)

def accumulate(accumulator:list):
    return sum(accumulator)


@test.reduce(accumulate)
def reduce(key, value, data: Data = None, index: int = None):
    if isinstance(value, int) and not isinstance(value, bool):
        return value


print("reduced:", reduce())

