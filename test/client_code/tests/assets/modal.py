"""
assets/modal.py
"""


def main(use):
    element = use("@@/element/")
    modal = use("@@/modal/")
    native = use("@@/native/")

    button = element.button(".anvil-btn.anvil-btn-default", text="Close")
    menu = element.menu(button)
    password = element.input(
        ".anvil-form-control", placeholder="Password", type="password"
    )

    content = element.div(password, menu)

    @element.on(button)
    def click(event):
        """."""
        node = content.closest("[_modal]")
        node.dispatchEvent(native.CustomEvent("_close", dict(detail=42)))

    result = modal(content, title="Test")

    print("result:", result)
