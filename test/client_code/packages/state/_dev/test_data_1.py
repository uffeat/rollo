from data import Data

print("members:", Data.members())




writable = Data(foo=42, temp=None)


print("writable.foo:", writable.foo)
writable.foo = 'FOO'

writable(bar=8)
print("writable:", writable)
writable.clear()
print("writable:", writable)



