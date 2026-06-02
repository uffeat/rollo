from data import Base, Data, State, state



@state(foo=42, run=True)
class stuff(Base):
    def __init__(self, state: State):
        """."""
        Base.__init__(self, state=state)

    @property
    def state(self) -> State:
        return self._['state']



    def onchange(self, **change):
        """."""
        print("state:", self.state)
        print("onchange got change:", change)








print("stuff.name:", stuff.name)

stuff(bar=8)

print("stuff:", stuff)
