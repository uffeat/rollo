class Error(Exception):
    props = dict(name=None, foo=None)

    def __init__(self, message: str, **props):
        super().__init__(message)
        for k, v in self.props.items():
            setattr(Error, k, property(lambda self, k=k: props.get(k, v)))

        owner = self
        class when:
            def __init__(self, *args, **kwargs):
                self.args = args
                self.kwargs = kwargs
            def __call__(self, predicate):
                if predicate(*self.args, **self.kwargs):
                    raise owner
                   
        Error.when = property(lambda self: when)



    def __call__(self):
        raise self


my_error = Error("Bad", name="BadError", foo=42)

##my_error.name = 'foo'

##my_value_error = ValueError('Bad value')


print("name:", my_error.name)
print("foo:", my_error.foo)
##print('name:', my_value_error.__class__.__name__)
##print('name:', type(my_value_error).__name__)
##print(my_error.__class__.__dict__)

##print(my_error.__class__.__dict__.get('name'))

my_error = Error("BadBad", foo='FOO')
print("name:", my_error.name)
print("foo:", my_error.foo)

@my_error.when(2)
def predicate(value):
    return value <10
