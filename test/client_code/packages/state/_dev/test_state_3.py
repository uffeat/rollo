from state import State, Message



state = State(dict(foo='FOO'))


@state.effect()
def effect(message: Message):
    for key in Message.keys():
        value = getattr(message, key)
        print(f"effect got {key}:", value)

def my_effect(message: Message):
    for key in Message.keys():
        value = getattr(message, key)
        print(f"my_effect got {key}:", value)


state.effects.add(my_effect, protected=True)


    

state(foo=42)

state.effects.clear()

state(foo=43)






