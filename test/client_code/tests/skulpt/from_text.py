"""
skulpt/from_text.py
"""


def main(use, *args, **kwargs):
  
    use("@@/assets/")
    anvil, app, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
        use.app,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.packages,
        use.tools,
        use.window,
    )
  
    importMainWithBody = window.Sk.importMainWithBody

    body = """
    print(42)

    ding = 42
    dong = {"dong": "DONG"}

    def main():
        return 42


    """
    foo = importMainWithBody(None, False, body, False)

    
