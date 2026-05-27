from data import Data, State, state



@state(foo=42, run=True)
def stuff(state, **change):
    print("state:", state)
    
    print("on_change got change:", change)






print("stuff.name:", stuff.name)

stuff(bar=8)

print("stuff:", stuff)
