> v.1.0

# About

History-based browser router and related tools. The router is a singleton and is exposed in two versions: `Router` and `router`. The latter offers a leaner syntax.

# How it works

## Registration

- Routes are registered as path-router pairs with `router.routes.add({...})`
- Registered paths can be nested; examples: `/foo`, `/foo/bar`
- Registered routes should be (async) functions or objects that expose (async) 'enter', 'update' and 'exit' methods.

## Invocation

- A given route is invoked with `router(specifier, options)`.
- The `specifier` should be an url string; examples: `/foo`, `/foo/bar?ding=42&ping=pong`
- The router then (conceptually):
  1.  Determines if the url has changed and aborts if no change. Reordered query does NOT count as change, e.g., `/foo?ding=42&ping=pong` is considered the same as `/foo?ping=pong&ding=42`.
  2.  Creates a /**query**/ object for the search part of the specifier subject to interpretation:
      - Numeric values are interpreted as numbers.
      - The value of "value-less" items ('') is interpreted as `true`.
      - 'true' values is interpreted as `true`.
      - 'false', 'null' and 'undefined' values are ignored.
        These interpretation rules also apply when determining if the url has changed.
  3.  Looks for a registered route that matches the path-part of the specifier. If e.g., routes for both `/foo` and `/foo/bar` are registered, the longer one (`/foo/bar`) is selected. If e.g., the specifier path-part is `/ding/dong` and a router has been registered with `/ding` (and none with `/ding/dong`), the `/ding` route is selected and a /**residual**/ array, `['dong']` is created.
  4.  If a registered route is found, the router determines if we have a route change or if only the residual and/or the query has changed. The following scenarios are handled:
      1.  If we have a route change any previous route is called with `route({ exit: true })` and the new route is called with `route({ enter: true }, url.query, ...residual)`. Alternatively, if the previous route is not a function, but an object with an `exit` method this method is called. Similarly, if the new route is not a function, but an object with an `enter` method this method is called.
      2.  If we do not have a route change, the current route is called with `route({ update: true }, url.query, ...residual)`. Alternatively, if the current route is not a function, but an object with an `update` method this method is called.
  5.  If a registered route is not found, looks for a matching `x.html`-type asset in `/pages`, `@/pages` and `@@/pages` and uses this asset as fallback route. This means that the router can be used without any explicit route registration at all. However, residuals cannot be used for fallback routes.
  6.  If neither a registered nor a fallback route is found, the router moves on to error handling. If the router has been set up with or if the invokation is made with `{strict: true}` (default), the router displays an error page (default or custom).

### pushState

Any new state is pushed before the "contoller part", i.e., route invocation. However, the code is structured in such a way that this order can easily be changed.

### Signals

Although not part of the routing per se, the router sends signals re changes. Notably, external code can go `router.effects.path.add(effect, <options>, <condition>);`. This effect is then called every time there is a path change with the query object and any residuals passed in as extra arguments (see `@/state.js`). In principle, the router could be used without routes (registered or fallback) and do the actual controlling via effects.

## Setup

To activate the router `router.setup()` must be called, typically after registration of routes. The setup allows setting 'strict mode' as well as a custom error handler. `{strict: false}` is useful during testing.

## Triggering

How we go from a user action to calling `router()` is technically not part of the routing per se. Typically, we need:

- A way to go from click to `router()`
- A way to manage active state in nav groups.

This can be wired up manually (with or without using router-emitted "signals"), but to avoid this, the parcel also exposes a Nav function and a NavLink component with two special props: `path` and `query`. Clicking a NavLink component invokes `router()` with a specifier contructed from the component's `path` and `query`. The Nav function accepts and returns a nav component. The function hooks into the router signal to manage the selected state of contained NavLinks. In this way, NavLink selected states are correctly handled not only at click, but also initially and during forward/back navigation.

NavLinks play well with Bootstrap, but do not require Bootstrap.

# Tips & tricks

- Set up routes explicitly as `x.html` type assets like so:
  `router.routes.add({"/boom": (await use("/pages/boom.x.html"))()});`
- For non-trivial cases, use reactive tools (`@/state.js`) to setup reactions to `enter/update/exit` and to `query`.
- Register simple non-nested paths.
- For aux data, prefer query over residuals.
