"""
component/component.py
"""


def main(use, *args, **kwargs):

    use("@@/assets/")
    anvil, console, document, js, log, meta, native, window = (
        use.anvil,
        use.console,
        use.document,
        use.js,
        use.log,
        use.meta,
        use.native,
        use.window,
    )
    ##app = use("@@/app/", test=meta.test)
    
    
    component = use("@@/component/", test=meta.test)

    frame = document.getElementById('frame')
    parent = frame.querySelector('main[anvil-slot="default"]')

    

    element = component.h1(text='New component', parent=parent)
    ##log("element:", element, trace="test", native=True)  ##
