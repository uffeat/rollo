from state import State, Message

state = State()


@state.effect()
def effect(message: Message):
    for key in Message.keys():
        value = getattr(message, key)
        print(f"effect got {key}:", value)


state(foo=42, bar='BAR')
state(foo=43, bar='bar')
state()
print("state.foo:", state.foo)

state(dict(stuff='STUFF'))
state.stuff = 'stuff'


print("state.current:", state.current)





