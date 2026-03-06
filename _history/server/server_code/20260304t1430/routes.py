from anvil.server import FormResponse, route, get_session_id, request
from .tools import DEV, PROD, access, api, log


class main:
    """Universal router."""

    _ = {}

    def __call__(self, **kwargs):
        paths = [v for k, v in kwargs.items() if k.startswith("_") and len(k) == 2]
        page = paths[0] if paths else "main"
        path = f"/{'/'.join(paths)}"
        query = {
            k: self.convert(v)
            for k, v in kwargs.items()
            if not k.startswith("_") and len(k) > 2
        }

        meta = dict(
            origin=request.origin,
            page=page,
            path=path,
            query=query,
            session=get_session_id(),
            targets=list(api.registry.keys()),
        )

        if page == "iworker":
            if PROD or access():
                return FormResponse(page, **meta)
            else:
                return ""

        if page == "blog":
            return FormResponse(page, **meta)

        if page == "login":
            return FormResponse(page, **meta)

        if page == "test":
            if access():
                return FormResponse(page, **meta)
            else:
                return ""

        return FormResponse(path, **meta)

    @staticmethod
    def convert(v):
        """Converts value of query item."""
        if v is None or v == "" or v == "true":
            return True
        if v == "false":
            return False
        try:
            return int(v)
        except:
            return v


main = main()


# Allow arbitrary path parts until depth level 4
route("/", methods=["GET"])(main)
for index in range(4):
    route(("").join([f"/:_{i}" for i in range(index)]), methods=["GET"])(main)
