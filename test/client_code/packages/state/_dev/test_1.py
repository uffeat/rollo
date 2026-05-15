from state import State, Message



state = State(name="foo")


@state.effect()
def effect(message: Message):
    """Tests reative primitives."""
    session = message.session
    print('session:', session)
    change = message.change
    print('change:', change)
    current = message.current
    print('current:', current)
    

state(42)
state(8)
