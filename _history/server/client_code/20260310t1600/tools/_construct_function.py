def construct_function(text: str) -> callable:
    """Returns main function from text."""
    locals = {}
    exec(text, {}, locals)
    if "main" not in locals:
        raise ValueError(
            f"'main' function not found in script (trace: {__file__})."
        )
    return locals["main"]
