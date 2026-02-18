"""
echo/echo.py
"""


def main(use):

    echo = use("@@/echo/")
    result = echo(42)
    print("result:", result)

    echo = use("@/echo").echo
    result = echo(42)
    print("result:", result)

    echo = use("/echo").echo
    result = echo(42)
    print("result:", result)

    echo = use("assets/echo.js").echo
    result = echo(42)
    print("result:", result)

    echo = use("rpc/echo", dict(spinner=True))
    response = echo(42)
    result = response.get("result")
    print("result:", result)

    server = use("@/server").server
    response = server.echo(42)
    result = response.result
    print("result:", result)
