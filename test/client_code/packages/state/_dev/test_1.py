from state import Ref, State, Message, instantiate



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





@state.effect()
@instantiate()
class intermediary:
    def __init__(self):
        self._ = dict(state=Ref())

        
    def __call__(self, message: Message):
        current = message.current
        print('current:', current)
        if isinstance(current, int) and not isinstance(current, bool) and current < 40:
            self.state(current)

        

    @property
    def state(self):
        return self._['state']



    

state(42)
state(8)


