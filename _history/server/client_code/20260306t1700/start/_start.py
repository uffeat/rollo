from ..component import component
from ..console import console, log
from ..meta import meta
from ..use import use
from ..works import works

"""HACK"""
works.get_user()

log(trace=__file__)

if meta.iworker:

    component.menu(
        ".d-flex.w-100.my-3",
        component.a(
            ".btn.btn-success", text="Go to app", href=meta.client.origin, margin="auto"
        ),
        parent=use.main.app,
    )
else:
    from ..frame import Frame

    ##from ..login import Login

    frame = Frame()

    use.main.append(frame)

    ##frame = use("@/frame/").frame
    ##use.main.app.append(frame)

    ##setup = use("@/routes/").setup
    ##setup()

    ##Login()


class start(works.Spacer):

    def __init__(
        self,
        page: str = None,
        path: str = None,
        query: dict = None,
        session: str = None,
        targets: list = None,
        **props,
    ):
        """."""
        log("page:", page)  ##
        log("path:", path)  ##
