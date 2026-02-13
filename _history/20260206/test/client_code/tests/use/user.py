"""
use/user.py
"""


def main(use):

    def get_target(name: str):
        """Simulates handling of requests."""
        if ':' in name:
            return use(f"@@/{name}")
        return use(f"@@/{name}/")
    

    user = get_target("user")
    print("user:", user)

    foo = get_target("user:foo")
    print("foo:", foo)
