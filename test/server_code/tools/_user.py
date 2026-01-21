from anvil.users import (
    get_user as _get_user,
)


def get_user_details(row=None) -> dict:
    """Returns None or user details."""
    if not row:
        row = _get_user()
    if row:
        return dict(email=row.get("email"))
