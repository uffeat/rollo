from data import Data, State, Message



test = State(foo='FOO', bar='BAR')


print('test:', test)
print('current:', test.current)
print('change:', test.change)
print('previous:', test.previous)



test(foo=42, bar=None)
print('test:', test)
print('current:', test.current)
print('change:', test.change)
print('previous:', test.previous)

test.effects.clear()

test(foo=43)






