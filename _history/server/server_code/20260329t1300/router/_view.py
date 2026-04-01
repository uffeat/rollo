from ..tools import Response, log, meta, render, session_id

# NOTE Similar to FormResponse, but for html templates.
class View:
    kwargs = dict(
        client=meta.client.origin,
        env=meta.env,
        session_id=session_id,
    )

    def __call__(self, template: str, **kwargs):
        """Returns rendered template as html asset."""
        # Sanitize kwargs to avoid dupe (overwrites)
        kwargs.pop("template", None)
        # Amend kwargs (overwrites)
        kwargs.update(self.kwargs)
        return Response(
            body=render(
                f"{template}",
                template=template,
                **kwargs,
            ),
            content_type="html",
            cors=True,
        )


View = View()
