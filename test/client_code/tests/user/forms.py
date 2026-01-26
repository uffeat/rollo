"""
user/forms.py
"""


def main(use):

    document = use("@@/document/")
    element = use("@@/element/")

    delete_with_form = use("@@/user:delete_with_form")
    get_user = use("@@/user:get_user")
    login_with_form = use("@@/user:login_with_form")
    logout_with_form = use("@@/user:logout_with_form")
    reset_with_form = use("@@/user:reset_with_form")
    signup_with_form = use("@@/user:signup_with_form")

    menu = element.menu(parent=document.body, display="flex", gap="1rem", margin="1rem")


    login_button = element.button("Log in", parent=menu)
    @element.on(login_button)
    def click(event):
        result = login_with_form()
        print("result:", result)


    get_user_button = element.button("Get user", parent=menu)
    @element.on(get_user_button)
    def click(event):
        result = get_user()
        print("result:", result)


    logout_button = element.button('Log out', parent=menu)
    @element.on(logout_button)
    def click(event):
        result = logout_with_form()
        print('result:', result)


    signup_button = element.button('Sign up', parent=menu)
    @element.on(signup_button)
    def click(event):
        result = signup_with_form()
        print('result:', result)

    delete_button = element.button('Delete account', parent=menu)
    @element.on(delete_button)
    def click(event):
        result = delete_with_form()
        print('result:', result)

    reset_button = element.button('Send reset link', parent=menu)
    @element.on(reset_button)
    def click(event):
        result = reset_with_form()
        print('result:', result)



##uffeat@gmail.com