from data import Data, Message, State

state = State(foo=42, bar=8)


@state.effect(run=True)
def effect(message: Message) -> None:
    print("effect got message:", message)


state(bar=None)


state(ding=2, foo=42)
state(foo=43)
state(ping=1)
