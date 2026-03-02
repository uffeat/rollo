from datetime import date, datetime

# TODO Check frontend app's build tools for a better way to format


def text_to_date(text: str) -> date:
    """Interprets iso-date string to date object."""
    return datetime.date.fromisoformat(text)


def text_to_datetime(text: str) -> datetime:
    """Interprets iso-datetime string to datetime object."""
    return datetime.datetime.fromisoformat(text)


def date_to_text(d: date) -> str:
    """Returns string interpretation of date object"""
    return f"{d:%Y-%m-%d}"


def datetime_to_text(dt: datetime) -> str:
    """Returns string interpretation of datetime object"""
    return f"{dt:%Y-%m-%d %H:%M}"
