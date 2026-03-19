"""
packages/echo/echo.py
"""


def main(use, *args, **kwargs):

    echo = use("@@/echo/", test=True)
    result = echo(42)
    print("result:", result)

   
