"""
modal/modal.py
"""


def main(use):

   

    modal = use.anvil.alert

    get_dom_node = use.anvil.get_dom_node
    Button = use.anvil.Button
    ColumnPanel = use.anvil.ColumnPanel
    FlowPanel = use.anvil.FlowPanel
    Label = use.anvil.Label
    TextBox = use.anvil.TextBox

    container = ColumnPanel()

    instruction = Label(
        text="""Please provide the email associated with your account. 
A reset link will be sent to that email."""
    )

    container.add_component(instruction)

    text_box = TextBox(placeholder="Email", tooltip="Email", type="email")

    container.add_component(text_box)

    message = Label(foreground="#ea868f")
    message.visible = False

    container.add_component(message)

    send_button = Button(text="Send", tag="send", role="send")
    node = get_dom_node(send_button)
    node.style.marginTop = "1rem"

    def onclick(**event):
        if not text_box.text.strip():
            return

        node = get_dom_node(container)
        input_element = node.querySelector("input")
        valid = input_element.checkValidity()
        if valid:
            message.visible = False
            message.text = None
        else:
            message.visible = True
            message.text = "Invalid email"
            return

        email = text_box.text

        container.raise_event("x-close-alert", value=email)

    send_button.add_event_handler("click", onclick)

    menu = FlowPanel(align="right")
    menu.add_component(send_button)

    container.add_component(menu)

    email = modal(
        container,
        role="reset_password",
        title="Reset password",
        buttons=None,
    )

    print("email:", email)
