import json
from ..tools import Response, get_asset_text, log, meta, render


# NOTE Similar to FormResponse, but for jinja templates.
class View:
    def __call__(
        self,
        template: str,
        test: bool = False,
        data: dict = None,
    ):
        """Returns rendered template as html asset."""
        if not '.' in template:
            template = f'{template}.jinja'
        html = get_asset_text(template, test=test)
        data = data or {}
        return Response(
            body=render(
                html,
                client=meta.client.origin,
                **data,
            ),
            content_type="html",
            cors=True,
        )


View = View()
