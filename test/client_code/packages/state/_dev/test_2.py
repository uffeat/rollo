from state import State, Message

state = State()


@state.effect()
def effect(message: Message):
    for key in Message.keys():
        value = getattr(message, key)
        print(f"effect got {key}:", value)


state(foo=42, ding='DING')
state(foo=43, ding='ding')
state()
print("state.foo:", state.foo)

state(dict(ping='PING'))


print("state.current:", state.current)




