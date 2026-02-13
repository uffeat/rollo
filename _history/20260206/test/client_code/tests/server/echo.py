"""
server/echo.py
"""


def main(use):

  document = use("@@/document/")
  element = use("@@/element/")
  rpc = use("@@/tools:rpc")

  result = rpc.echo(1, 2, 3)
  print('result:', result)






  


  


  

 





