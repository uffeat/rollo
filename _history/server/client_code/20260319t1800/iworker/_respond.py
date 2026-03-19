from ..console import console, log
from ..tools import Promise
from ..use import use
from ..works import works
from ._event import Event
from ._iframe import iframe


def respond(event: Event) -> None:
    args, kwargs, specifier, submission, test, visible = (
        event.args,
        event.kwargs,
        event.specifier,
        event.submission,
        event.test,
        event.visible,
    )
    try:
        # Get target
        target = use(specifier, test=test)
        # Sync app height -> client iframe height
        visible and iframe.sync.start()
        # Create instance
        if isinstance(target, type):
            if "__init__" in target.__dict__:
                instance = target(event=event)
            else:
                instance = target()
            if visible and issubclass(target, works.HtmlTemplate):
                use.main.child = instance
        else:
            instance = target
        # Get result
        result = instance(*args, **kwargs) if callable(instance) else None
        if isinstance(result, Promise):
            result = result.wait()
        # Remove sync to client iframe
        visible and iframe.sync.stop()
        if result is event:
            """XXX target returns event -> target responds. Use with care, since
            risk of blocking client."""
        else:
            event(result=result, submission=submission)
    except Exception as error:
        visible and iframe.sync.stop()
        # Respond
        event(
            error=f"Error when calling '{specifier}': {str(error)}",
            submission=submission,
        )


