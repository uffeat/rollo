from ..tools import access, meta

# Default page
START = "start"

# NOTE Declared page:spec items
pages = dict(
    # Form routes
    iworker=dict(require=lambda: meta.PROD or access()),
    login=dict(),
    signup=dict(),
    start=dict(),
    test=dict(require=lambda: meta.DEV or (meta.PROD and access())),
    # View routes
    blog=dict(view="blog/blog.jinja"),
    foo=dict(view="foo/foo.jinja"),
)

# NOTE 'page' -> 'page' (useful for hyphenated form responses)
redirects = {
    "user-login": "login",
    "user-signup": "signup",
}


# NOTE 'path' -> 'path' (useful for compact page/view responses)
rewrites = {
    "/front": "/front/index.html",
   
}
