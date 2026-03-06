import datetime


def get_timestamp() -> str:
    return f"{datetime.datetime.now():%Y-%m-%d %H:%M:%S}"
  
