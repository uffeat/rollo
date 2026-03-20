"""
packages/echo/echo.py
"""


def main(use, *args, **kwargs):
    """Tests echo package."""

    console = use("@@/console/")
    console.log("Tests echo package")

   

    echo = use("@@/echo/", test=True)
    result = echo(42)
    print("result:", result)

   
