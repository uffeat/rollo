from ..tools import access, meta

START = "start"

pages = dict(
    blog=dict(),
    iworker=dict(require=lambda: meta.PROD or access()),
    login=dict(),
    signup=dict(),
    start=dict(template="start/start.jinja"),
    test=dict(require=lambda: meta.DEV or (meta.PROD and access())),
    # For testing
    foo=dict(view="templates/pages/foo.jinja"),
)

redirects = {"user-login": "login", "user-signup": "signup"}
