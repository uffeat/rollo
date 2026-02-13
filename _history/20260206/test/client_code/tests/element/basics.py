"""
element/basics.py
"""


def main(use):

    console = use("@@/console/")
    document = use("@@/document/")
    element = use("@@/element/")

    button = element.button(
        ".foo",
        element.span(" me"),
        parent=document.body,
        text="Click",
        value="yes",
        stuff=True,
        bar="bar",
        color='pink'
    )

    console.log('button:', button)

    @element.on(button, once=True)
    def click(event):
        print('Clicked!')
