"""
assets/modal.py
"""


def main(use):
    element = use("@@/element/")
    modal = use("@@/modal/")
    native = use("@@/native/")

    button = element.button(".anvil-btn.anvil-btn-default", text="Submit")
    menu = element.menu(button)

    password = element.input(
        ".anvil-form-control", placeholder="Password", type="password"
    )
    password_repeat = element.input(
        ".anvil-form-control", placeholder="Password (repeat)", type="password"
    )

    message = element.p()

    form = element.form(password, password_repeat)

    content = element.div(form, message, menu)

    @element.on(button)
    def click(event):
        """."""
        message.textContent = None
        if not password.value.strip() or not password_repeat.value.strip():
            message.textContent = 'Please provide passwords.'
            return

        if password.value != password_repeat.value:
            message.textContent = 'Passwords do not match.'
            return
        
        


        node = content.closest("[_modal]")
        node.dispatchEvent(native.CustomEvent("_close", dict(detail=42)))

    result = modal(content, title="Reset password")

    print("result:", result)
