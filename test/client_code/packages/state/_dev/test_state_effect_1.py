from data import Condition, Data, Message, State

my_state = State(foo=42, bar=8).configure(name="my_state")


@my_state.effect(condition=Condition("bar", "ding", "foo"), run=True)
def my_effect(message: Message) -> None:
    print("effect got message:", message)
    print("effect reacts to changes in state:", message.state)

    print("message.state.current.foo:", message.state.current.foo)

    print("message.effect:", message.effect)
    print("message.effect.__name__:", message.effect.__name__)

    print("message.data:", message.data)
    message.data(thing="Changed thing")

    def parse(foo=None, **kwargs):
        print("foo:", foo)

    parse(**message)


my_state(bar=None)


my_state(ding=2, foo=42)
my_state(foo=43)
my_state(ping=1)

print("my_state.name:", my_state.name)
print("my_state['name']:", my_state["name"])
