from datetime import datetime, timedelta, timezone
from anvil.server import cookies
from anvil.users import (
    AccountIsNotEnabled,
    AuthenticationFailed,
    EmailNotConfirmed,
    PasswordResetRequested,
    TooManyPasswordFailures,
    UserExists,
    force_login,
    get_user as _get_user,
    login_with_email,
    logout as _logout,
    send_password_reset_email as _send_password_reset_email,
    signup_with_email,
)

from .tools import Api, api


@api()
class get_user(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self):
        """."""
        return cookies.local.get("user")


@api()
class login(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, email: str = None, password: str = None):
        """."""
        try:
            row = login_with_email(email, password, remember=False)
        except AuthenticationFailed:
            del cookies.local["user"]
            return dict(ok=False, message="Invalid credentials")
        except EmailNotConfirmed:
            del cookies.local["user"]
            return dict(ok=False, message="Email not confirmed")
        except AccountIsNotEnabled:
            del cookies.local["user"]
            return dict(ok=False, message="Account disabled")
        except PasswordResetRequested:
            del cookies.local["user"]
            return dict(ok=False, message="Pending password reset")
        except TooManyPasswordFailures:
            del cookies.local["user"]
            return dict(ok=False, message="Too many login failures")

        ##force_login(row, remember=False)
        data = dict(
            email=row["email"], timestamp=datetime.now(timezone.utc).isoformat()
        )
        cookies.local["user"] = data
        return dict(ok=True, data=data)


@api()
class logout(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self):
        """."""
        _logout(invalidate_client_objects=False)
        del cookies.local["user"]


@api()
class signup(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, email: str = None, password: str = None):
        """."""
        try:
            row = signup_with_email(email, password)
        except UserExists:
            del cookies.local["user"]
            return dict(ok=False, message="Email not available")

        ##force_login(row, remember=False)
        data = dict(
            email=row["email"], timestamp=datetime.now(timezone.utc).isoformat()
        )
        cookies.local["user"] = data
        return dict(ok=True, data=data)


@api()
class send_password_reset_email(Api):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __call__(self, email: str = None):
        """."""
        try:
            _send_password_reset_email(email)
            del cookies.local["user"]
        except:
            return dict(ok=False, message="Could not send email.")
        return dict(ok=True)
