"""
server/echo.py
"""


def main(use, *args, **kwargs):

  
  rpc = use("@@/server:rpc")

  result = rpc.echo(1, 2, 3)
  print('result:', result)






  


  


  

 





