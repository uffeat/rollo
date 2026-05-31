from data import Data, State, Message



test = State(Data(foo='FOO', bar='BAR'))
print('test:', test)


test = State(State(foo='FOO', bar='BAR'))
print('test:', test)





