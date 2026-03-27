from anvil.server import FormResponse, route
from ..tools import Response, access, log, meta, render, session_id


class router:
    """Universal router."""

    _ = dict(
        names={"user-login": "login"},
        pages=set(["blog", "iworker", "login", "signup", "start", "test"]),
        require=dict(iworker=lambda: meta.PROD or access()),
        targets=["echo"],
    )

    def __call__(self, **kwargs):
        paths = [v for k, v in kwargs.items() if k.startswith("_") and len(k) == 2]
        page = paths[0] if paths else "start"
        path = f"/{'/'.join(paths)}"
        query = {
            k: self.convert(v)
            for k, v in kwargs.items()
            if not k.startswith("_") and len(k) > 2
        }
        # Apply any alias
        page = self._["names"].get(page, page)
        # Check page
        if page not in self._["pages"]:
            return Response(
                body=render(
                    "templates/errors/error",
                    ##base=f"{meta.client.origin}",
                    client=meta.client.origin,
                    env=meta.env,
                    message=f"Invalid page: {page}",
                ),
                content_type="html",
                cors=True,
            )
        # Check requirements
        require = self._["require"].get(page)
        if require:
            if not require():
                return Response(
                    body=render(
                        "templates/errors/error",
                        base=f"{meta.client.origin}/",
                        client=meta.client.origin,
                        env=meta.env,
                        message="No access",
                    ),
                    content_type="html",
                    cors=True,
                )
        return FormResponse(
            page,
            origin=query.pop('origin', None),
            page=page,
            path=path,
            query=query,
            session_id=session_id,
            targets=self._["targets"],
        )

    @staticmethod
    def convert(v):
        """Converts value of query item as per convention."""
        if v is None or v == "" or v == "true":
            return True
        if v == "false":
            return False
        try:
            return int(v)
        except:
            return v


router = router()


# Allow arbitrary path parts until depth level 4
route("/", methods=["GET"])(router)
for index in range(4):
    route(("").join([f"/:_{i}" for i in range(index)]), methods=["GET"])(router)

