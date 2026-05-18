from state import Ref, State, Message, instantiate



state = Ref(2)


@state.effect()
@instantiate()
class intermediary:
    def __init__(self):
        self._ = dict(state=Ref())

    def __call__(self, message: Message):
        ##print('current:', message.current)
        if isinstance(message.current, int) and not isinstance(message.current, bool) and message.current < 40:
            self.state(message.current)

    @property
    def state(self):
        return self._['state']
    
@intermediary.state.effect()
def effect(message: Message):
    print('current:', message.current)




    

state(42)
state(8)


