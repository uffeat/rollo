"""
server/echo.py
"""


def main(use, *args, **kwargs):

    rpc = use("@@/server:rpc")

    

    # Classic
    response = rpc(
        "echo",
        args=[1, 2, 3],
        kwargs=dict(foo="FOO"),
        options=dict(spinner=True, test=True),
    )
    print("Classic response:", response)

    # Proxy
    response = rpc.echo(dict(spinner=True, test=True), 1, 2, 3, foo="FOO")
    print("Proxy response:", response)

    # Async proxy
    echo = rpc.echo

    @echo.then({})
    def callback(response):
        print("Async response:", response)

    echo(dict(spinner=True, test=True), 1, 2, 3, foo="FOO")

    # IIFE async proxy
    echo = rpc.echo

    @echo.then(dict(spinner=True, test=True), 1, 2, 3, foo="FOO")
    def callback(response):
        print("IIFE async response:", response)

    # Import engine
    
    response = use(
        "rpc/echo",
        1,
        2,
        3,
        kwargs=dict(foo="FOO"),
        options=dict(spinner=True, test=True),
       
    )
    print("Import engine response:", response)

