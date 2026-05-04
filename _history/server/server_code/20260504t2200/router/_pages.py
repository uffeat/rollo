from ..tools import access, meta

# Default page
START = "start"

# Declared pages (page:spec items)
pages = dict(
    # Form routes
    iworker=dict(require=lambda: meta.PROD or access()),
    login=dict(),
    plot=dict(),
    signup=dict(),
    start=dict(),
    test=dict(require=lambda: meta.DEV or (meta.PROD and access())),
    # View routes
    blog=dict(view="blog/blog.jinja"),
    foo=dict(view="foo/foo.jinja"),
)

# 'page' -> 'page'
redirects = {
    "user-login": "login",
    "user-signup": "signup",
}
# Browser routes
redirects.update(about=START, front=START, home=START, stats=START)


# 'path' -> 'path'
rewrites = {
    "/front": "/front/index.html",
}
