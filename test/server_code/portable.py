from anvil.server import portable_class as portable
from tools import connect, server_function

import person

Person = person.Person


keep = connect()




@server_function
def get_person():



    






    # Look up the person - in a database, perhaps.
    return Person("John", "Smith") 


keep("Running local server for serving 'get_person'.")
