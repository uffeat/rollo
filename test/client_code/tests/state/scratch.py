"""
state/scratch.py
"""


def main(*args, **kwargs):
    """."""

    

    class Stuff:
        """."""

        def __init__(self):
            self.__dict__.update(_={})


        
            

            

        def __getattr__(self, key):
            print(f"__getattr__ returns {key}")
            
            return self._.get(key)
        
        def __getitem__(self, key):
            ##print(f"__getitem__ returns {key}")
            
            return self._.get(key)
        
        def __setattr__(self, key, value) -> None:
            ##print(f"__setattr__ sets {key} to {value}")
            self._[key] = value


        

        def __setitem__(self,key, value):
            ##print(f"__setitem__ sets {key} to {value}")
            self._[key] = value

        @property
        def foo(self):
            return 42

    stuff = Stuff()

    ##print("foo:", stuff.foo)
    ##stuff.bar = 8
    stuff['bar'] = 8
    ##print("bar:", stuff.bar)

    print("has foo:", hasattr(stuff, 'foo'))
    print("has bar:", hasattr(stuff, 'bar'))


    
try:
    main()
except:
    ...
