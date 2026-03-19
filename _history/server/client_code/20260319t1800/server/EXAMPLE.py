from ._rpc import rpc


result = rpc('echo', args=[1, 2, 3], kwargs=dict(foo=42))
print('result:', result)


result = rpc.echo.setup(state=dict(stuff='STUFF'))(1, 2, 3, foo=42)
print('result:', result)


result = rpc.echo(1, 2, 3, foo=42)
print('result:', result)