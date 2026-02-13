"""
user/login_with_form.py
"""


def main(use):

    login_with_form = use('@@/user:login_with_form')

    result = login_with_form(dict(allow_cancel=True, allow_remembered=False, show_signup_option=False))

    

    print("result:", result)
