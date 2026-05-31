from data import Data




writable = Data(foo=42, temp=None, record=Data(numbers=0, persons=0))


print("writable.foo:", writable.foo)
writable.foo = 'FOO'

writable(bar=8)

##writable.clean()



print("writable:", writable)
##writable.clear()
##print("writable:", writable)



