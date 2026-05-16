from state import Ref, State, Message



state = Ref(name="foo", ding=42)
state.detail.ding = 'DING'


@state.effect()
def effect(message: Message):
    """Tests reative primitives."""
    print('message.owner.detail:', message.owner.detail)
    print('session:', message.session)
    print('index:', message.index)
    print('previous:', message.previous)
    print('current:', message.current)

print('index:', state.effects.index(effect))



    

state(42)
state(8)


