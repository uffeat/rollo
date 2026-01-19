"""
echo/echo.py
"""


def main(use):

    window = use.window

    print('result:', window.use('@@/echo/')(42))



    echo = use('@@/echo/')
    result = echo(42)


    print('result:', result)




