"""
session/echo.py
"""


def main(use):

    


    echo = use("rpc/echo", dict(spinner=True))
    response = echo(42)
    ##result = response.get("result")
    ##print("result:", result)
    meta = response.get("meta")
    print("meta:", meta)

    server = use("@/server").server
    response = server.echo(42)
    ##result = response.result
    ##print("result:", result)
    meta = response.meta
    print("meta:", meta)
