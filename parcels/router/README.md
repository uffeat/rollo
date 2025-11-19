# About

History-based browser router that does not require route registration.

Partial support for nested routes. Fundamentally, the router is non-nested. However, route modules can use 'history.replaceState()' and use the 'residual' arg. When doing so, reload captures the nesting, but nesting does not extend to forward/back nav.

# How it works

Works with the import engine to dynamically import @/-modules.

## Using non-@/-routes

This can be done in multiple ways, incl.:

- By adding @/-modules to the imprt engine with 'use.add()'.
- By registering paths directly on 'router' with 'router.add()'.

Although these approaches essentially are 'one-route-at-the-time', both can be used with a batch pattern (see tests).

# Nav updates

Effecs can be registered on the router to enable management of active links.
