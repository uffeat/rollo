from datetime import datetime

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

hasher = PasswordHasher()

from anvil.tables import app_tables as db
from anvil.users import force_login, get_user as _get_user, logout
from anvil.server import get_app_origin
from anvil.tz import tzutc

from tools import Result, api, get_user_details, rpc


@rpc(binary=False)
class change_user:
    """."""

    def __call__(self, email=None, meta=None, password=None, raw=None, **updates):
        # Ensure that user is logged in
        row = _get_user()
        if not row:
            return Result(ok=False, message="User not logged in.")

        # TODO
        # Do not allow email change
        # Special treatment of password
        # Use a variant of get_user_details to extract valid updates from updates
        # Consider storing detail in a simple column


@rpc(binary=False)
class delete_user:
    """."""

    def __call__(self, **kwargs):
        # Ensure that user is logged in
        row = _get_user()
        if not row:
            return Result(ok=False, message="User not logged in.")
        # Extract exposed user details
        user = get_user_details(row=row)
        # Log out before deletion
        logout()
        row.delete()
        return Result(user=user)


@rpc(binary=False)
class get_user:
    """."""

    def __call__(self, **kwargs):
        row = _get_user()
        if not row:
            return Result(ok=False)
        # Extract exposed user details
        user = get_user_details(row=row)
        return Result(user=user)


@rpc(binary=False)
class login_user:
    """."""

    def __call__(self, email=None, password=None, **kwargs):

        # Check if already logged in
        row = _get_user()
        if row:
            user = get_user_details(row=row)
            return Result(ok=False, user=user)
        # Check if user exists
        row = db.users.get(email=email)
        if not row:
            return Result(ok=False, message="User not found.")
        # Check credentials
        hashed_password = row["hashed_password"]
        try:
            hasher.verify(hashed_password, password)
        except VerifyMismatchError:
            return Result(ok=False, message="Invalid password.")
        # Rehash as needed
        if hasher.check_needs_rehash(hashed_password):
            hashed_password = hasher.hash(password)
            row.update(hashed_password=hashed_password)
        # Log time
        row.update(last_login=datetime.now(tzutc()))
        # Sync to Anvil's native user management
        force_login(row)
        # Extract exposed user details
        user = get_user_details(row=row)
        return Result(user=user)


@rpc(binary=False)
class signup_user:
    """."""

    def __call__(self, email=None, password=None, **kwargs):
        # Check if already logged in
        row = _get_user()
        if row:
            user = get_user_details(row=row)
            return Result(ok=False, user=user)
        # Check if email already used
        row = db.users.get(email=email)
        if row:
            return Result(ok=False, message="User exists.")
        # Register new user
        hashed_password = hasher.hash(password)
        row = db.users.add_row(
            confirmed_email=True,
            email=email,
            enabled=True,
            hashed_password=hashed_password,
            signed_up=datetime.now(tzutc()),
        )
        # Sync to Anvil's native user management
        force_login(row)
        # Extract exposed user details
        user = get_user_details(row=row)
        return Result(user=user)


@rpc(binary=False)
class send_password_change_link:

    def __call__(self, email=None):
        """."""
        # Check if user exists
        row = db.users.get(email=email)
        if not row:
            return Result(ok=False, message="User not found.")

        # TODO Save datetime for later expiry check and cleanup

        # Create link
        hashed_password = row["hashed_password"]
        # TODO
        # Send email
        # TODO

        user = get_user_details(row=row)
        return Result(user=user)


# TODO Decide if api or rpc
@api()
@rpc(binary=False)
class complete_password_change:
    """."""

    def __call__(self, email=None, hashed_password=None, password=None, **kwargs):
        # Check if user exists
        row = db.users.get(email=email)
        if not row:
            return Result(ok=False, message="User not found.")
        # Verify hashed_password
        if hashed_password != row["hashed_password"]:
            return Result(ok=False, message="Invalid hash.")

        # TODO Expiry check and cleanup

        # Update hashed_password
        hashed_password = hasher.hash(password)
        row.update(hashed_password=hashed_password, last_login=datetime.now(tzutc()))
        # Sync to Anvil's native user management
        force_login(row)
        # Extract exposed user details
        user = get_user_details(row=row)
        return Result(user=user)


# TODO Perhaps(?) scheduled task that cleans up expired reset-related data
