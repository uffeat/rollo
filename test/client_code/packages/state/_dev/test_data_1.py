from data import Data

view = Data(foo=42).freeze()


print("view:", view)

writable = Data(foo=42)


print("writable.foo:", writable.foo)
writable.foo = 'FOO'

writable(bar=8)
print("writable:", writable)

