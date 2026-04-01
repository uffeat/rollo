class Error(Exception):
    """Conditional JS-friendly error implmentation."""

    def __init__(self, name: str = None):
        # Set name (error type cue)
        self.__ = dict(name=name)

    def __call__(self, message, *args):      
        # Parse value from args to support invokation from JS
        self.__.update(value=args[0] if args else None)
        # Handle callable message
        if callable(message):
            message = message(self)
            if not isinstance(message, str):
                # Wipe value
                del self.__['value']
                return
        # Invoke Exception inheritance (old-school, since Anvil can trip up 'super')
        Exception.__init__(self, message)
        self.__.update(message=message)
        raise self
    
    @property
    def message(self) -> str:
        """Returns error message."""
        return self.__.get('message', '')
    
    @property
    def name(self) -> str:
        """Returns error name ('type')."""
        return self.__['name']
    
    @property
    def value(self):
        """Returns error value (transient state)."""
        return self.__.get('value')
    

# Usage

bad_error = Error(name="BadError")


try:
    ##bad_error("Uh, uh!")  # Typical use
    bad_error(lambda error: 'Dammit!' if error.value else None, True)
except Exception as error:
    print(str(error))
    print('message:', error.message) # Same as str(error)
    print('name:', error.name)
    print('value:', error.value)
