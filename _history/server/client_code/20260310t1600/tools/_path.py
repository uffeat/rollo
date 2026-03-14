def Path(specifier: str):
    """Tool for parsing string paths.
    HACK 
    - True encapsulation and zero import pollution
    - Lean implementation of getters
    NOTE
    - Lightweight replica of JS implementation in 'client'.
    """
    DOT, SLASH = ".", "/"
    props = dict(specifier=specifier)

    """NOTE
    Since props are dynamically exposed, no need to init and to 
    explicitly set to None.
    """

    # source
    if specifier.startswith(SLASH):
        props["source"] = SLASH
    else:
        source, _, rest = specifier.partition(SLASH)
        if rest:
            props["source"] = source
    # file
    *_, file = specifier.rpartition(SLASH)
    if DOT in file:
        props["file"] = file
        # name and types
        name, _, types = file.partition(DOT)
        props["name"] = name
        props["types"] = types
        # type
        *_, type_ = types.rpartition(DOT)
        props["type"] = type_
    # Create class that exploits closures to expose getters dynamically
    class cls:
        
        def __getitem__(self, key):
            return props.get(key)

        def __getattr__(self, key):
            return self[key]
        
    return cls()


