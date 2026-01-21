"""
user/forms.py
"""


def main(use):

  user = use('@@/user')

  login_with_form = use("@@/user:login_with_form")
  logout_with_form = use("@@/user:logout_with_form")
  signup_with_form = user.signup_with_form

  result = logout_with_form()()
  print('result:', result)

  result = login_with_form()()
  print('result:', result)





