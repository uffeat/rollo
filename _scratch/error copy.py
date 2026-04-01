class Error(Exception):

    def __init__(self, name: str = None):
        self._ = dict(name=name)

    def __call__(self, message, *args):
        value = args[0] if args else None
        
        self._.update(value=value)
        
        if callable(message):
            message = message(self)
            if not isinstance(message, str):
                return
        
        Exception.__init__(self, message)
        self._.update(message=message)
        raise self
    
    @property
    def message(self) -> str:
        return self._.get('message', '')
    
    @property
    def name(self) -> str:
        return self._['name']
    
    @property
    def value(self):
        return self._.get('value')
    

# Usage

bad_error = Error(name="BadError")
##print('As string:', str(bad_error))

try:
    ##bad_error("Uh, uh!")  # Typical use
    bad_error(lambda error: 'Dammit!' if error.value else None, value=True)
except Exception as error:
    print(str(error))
    print('message:', error.message) # Same as str(error)
    print('name:', error.name)
    print('value:', error.value)
