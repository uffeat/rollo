from pathlib import Path
import sys


def bootstrap() -> Path:
    root = Path(__file__).parent.parent.resolve().parents[1]
    _root = str(root)
    if sys.path[0] != _root:
        if _root in sys.path:
            sys.path.remove(_root)
        sys.path.insert(0, _root)
    return root
