"""
modal/reset.py
"""


def main(use):

    send_password_reset_email = use.anvil.send_password_reset_email

    print("send_password_reset_email:", send_password_reset_email)

    Form = use("@/form/").Form
    Input = use("@/form/").Input
    Alert = use("/tools/alert").Alert

    modal = use("@@/modal/")
    component = use("@@/component/")
    reset = use("@@/user:reset")
    ##print("reset:", reset)  ##

    def content(close):

        submit = component.button(
            ".btn.btn-primary", type="button", text="Send", disabled=True
        )

        message = component.div()

        form = Form(
            ".d-flex.flex-column.gap-3",
            Input(dict(type="email", name="email", label="Email", required=True)),
            message,
            component.menu(
                ".d-flex.justify-content-end",
                submit,
            ),
        )

        def effect(change, message):
            """."""
            ##print("change", change)  ##
            valid = change.valid
            submit.disabled = not valid

        form["$"].effects.add(effect, ["valid"])

        @submit.on()
        def click(event):
            message.clear()
            if form.valid:
                email = form.data.email
                response = reset(email)
                if response.get('ok'):
                    submit.remove()
                    message.append(Alert('An email with a reset link has been sent', dict(style='success')))
                else:
                    message.append(Alert(response.get('message', ''), dict(style='danger')))

            ##close(True)

        return form

    result = modal(content, title="Reset password")
    print("result:", result)
