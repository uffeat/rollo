"""
portable/portable.py
"""


def main(use, *args, **kwargs):
    

    use("@@/assets/")
    anvil, console, document, js, log, meta, native, packages, tools, window = (
        use.anvil,
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
    app = use("@@/app/", test=meta.test)
    component = use("@@/component/")
    

    portable = anvil.portable_class
    call = anvil.server.call

    

    @portable
    class Person():
        
        def __init__(self, first_name, last_name):
            self.first_name = first_name
            self.last_name = last_name

        def get_full_name(self):
            return self.first_name + " " + self.last_name
        
    p = call("get_person")
    print(p.get_full_name())




