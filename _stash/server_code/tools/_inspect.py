def inspect_func(func) -> tuple:
    """Returns 'func' name, names of 'func' pos args withouth default and a flag to
    indicate if 'func' has args with default or a '**' arg."""
    code_object = func.__code__
    defaults = func.__defaults__ or ()
    has_kwargs = code_object.co_flags & 0x08 != 0
    # Determine number of positional args without default
    pos_args_n = code_object.co_argcount
    no_default_pos_args_n = pos_args_n - len(defaults)
    # Extract the names of pos parameters without default
    no_default_pos_arg_names = code_object.co_varnames[:no_default_pos_args_n]
    # Return results
    return (func.__name__, no_default_pos_arg_names, bool(defaults) or has_kwargs)
