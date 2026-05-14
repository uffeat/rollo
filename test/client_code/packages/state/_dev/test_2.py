from state import State, Message



state = State(name="foo")


@state.effect()
def effect(message: Message):
    for key in Message.keys():
        value = getattr(message, key)
        print(f"{key}:", value)
    

state(foo=42)


value = dict(foo=42)


type_ = type(value)

print(type_ is dict)
