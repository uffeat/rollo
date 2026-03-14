from anvil.js.window import Object
from ._type import typeName



def pythonize(value):
    """Returns Python interpretation of data structure that can contain JS arrays,
    JS plain objects, Python lists and Python dicts with any degree of nesting.
    Non-container values are left as-is.
    Primary use cases:
    - JS code calls a Python function with a JS data structure passed in.
    - Python code accesses JS objects (e.g. JS module import).
    """
    # Handle Python containers
    if isinstance(value, list):
        return [pythonize(v) for v in value]
    if isinstance(value, dict):
        return {k: pythonize(v) for k, v in value.items()}
    # Handle JS containers
    name = typeName(value)
    if name == "Array":
        return [pythonize(item) for item in value]
    if name == "Object":
        result = {}
        for key in Object.keys(value):
            result[str(key)] = pythonize(value[key])
        return result
    return value  # Non-container

    

   


