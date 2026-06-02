import pathlib, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent.parent))
from use import use

dong = use("@@/dong/").dong

print("dong:", dong)
