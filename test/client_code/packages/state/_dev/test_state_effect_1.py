from data import Data, State, state

##state = State(foo=42, bar=8)



@state(dict(foo=42), condition=['foo'])
def stuff(state, **change):
    print("state:", state)
    
    print("effect got change:", change)






print("name:", stuff.name)

stuff(bar=8)

print("stuff:", stuff)
