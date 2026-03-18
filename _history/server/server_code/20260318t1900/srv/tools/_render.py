from jinja2 import Template
from ._assets import get_asset_text


def render(name: str, **data) -> str:
    """Returns html rendered from jinja template and data."""
    text = get_asset_text(f"{name}.jinja")
    template = Template(text)
    html = template.render(**data)
    return html
