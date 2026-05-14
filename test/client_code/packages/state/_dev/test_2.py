from state import State, Message



state = State(dict(foo='FOO'))


@state.effect()
def effect(message: Message):
    for key in Message.keys():
        value = getattr(message, key)
        print(f"{key}:", value)
    

state(foo=42)



