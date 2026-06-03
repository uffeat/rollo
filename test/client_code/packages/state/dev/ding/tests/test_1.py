import pathlib, sys
from pathlib import Path


cwd = Path.cwd()
print('cwd:', cwd.as_posix())
print('__file__:', __file__)
print('__file__:', Path(__file__).as_posix())
p = Path(__file__).relative_to(Path.cwd())
print('p:', p)


sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent.parent))

from use import use


ding = use("@@/ding/").ding

print("ding:", ding)
