from data import Data, State, state

my_state = State(foo=42)


@my_state.hook()
def on_change(state: State, **change):
    print('on_change got change:', change)






my_state(bar=8)