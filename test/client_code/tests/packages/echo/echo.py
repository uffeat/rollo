"""
packages/echo/echo.py
"""


def main(use, *args, **kwargs):
    """Tests echo package."""

    console, document, log, meta = use.console, use.document, use.log, use.meta

    echo = use("@@/echo/", test=True)
    result = echo(42)
    log("result:", result)
