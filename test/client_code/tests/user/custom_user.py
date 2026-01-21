"""
user/custom_user.py
"""


def main(use):

  document = use("@@/document/")
  element = use("@@/element/")
  rpc = use("@@/tools:rpc")

  menu = element.menu(parent=document.body, display= 'flex', gap='1rem', margin='1rem')

  get_user_button = element.button('Get user', parent=menu)
  @element.on(get_user_button)
  def click(event):
    row = use.anvil.users.get_user()
    print('row:', row)


  signup_button = element.button('Sign up', parent=menu)
  @element.on(signup_button)
  def click(event):
    result = rpc.signup_user(email='uffeat@gmail.com', password='f')
    print('result:', result)


  login_button = element.button('Log in', parent=menu)
  @element.on(login_button)
  def click(event):
    result = rpc.login_user(email='uffeat@gmail.com', password='f')
    print('result:', result)


  logout_button = element.button('Log out', parent=menu)
  @element.on(logout_button)
  def click(event):
    result = use.anvil.users.logout()
    print('result:', result)






  


  


  

 





