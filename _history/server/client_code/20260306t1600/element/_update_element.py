from ..use import use


def update_element(
    instance, *args, html: str = None, parent=None, text: str = None, **props
):
    for key, value in props.items():
        if key in instance:
            setattr(instance, key, value)
            continue
        if key in instance.style:
            setattr(instance.style, key, value)
            continue
        # Handle non-standard
        if value is True:
            setattr(instance, key, value)
            instance.setAttribute(key, "")
            continue
        setattr(instance, key, value)
        if isinstance(value, str):
            instance.setAttribute(key, value)
    if args:
        first = args[0]
        if isinstance(first, str) and first.startswith("."):
            classes = first.split(".")[1:]
            instance.classList.add(*classes)
            args = args[1:]
        if args:
            instance.append(*args)
    if html:
        if html.startswith("assets/"):
            html = use(html)
        instance.insertAdjacentHTML("afterbegin", html)
    if text and hasattr(instance, "textContent"):
        instance.insertAdjacentText("afterbegin", text)
    if parent and parent is not instance.parentElement:
        parent.append(instance)

    return instance
