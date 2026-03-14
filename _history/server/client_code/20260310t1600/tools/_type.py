from anvil.js.window import Function, Object, eval



def getType(name: str):
    """."""
    return eval(name)



def typeName(value) -> str:
    return Object.prototype.toString.call(value)[8:-1]


def type_name(value) -> str:
    return str(type(value))[8:-2]


def is_instance(value, *refs) -> bool:
    """String-based isinstance/instanceof hybrid."""
    names = set([typeName(value), type_name(value)])
    return bool(
        len(names.intersection(set([r for r in refs if not r.startswith("!")])))
        and not len(names.intersection(set([r[1:] for r in refs if r.startswith("!")])))
    )


_instanceOf = Function("value, ref", "return value instanceof ref")


def instanceOf(value, ref) -> bool:
    """Wrapper for JS instanceof operator."""
    return _instanceOf(value, ref)


_typeOf = Function("value", "return typeof value")


def typeOf(value) -> str:
    """Wrapper for JS typeof operator."""
    return _typeOf(value)


