# Consider

- Place in worker (perhaps optional). Probably requires submission tracking.
- Implement spinner (explicit option or some kind of auto-detection based on background vs. non-background).

# Ideas

- Type system for sent data and recived data, e.g., serialized files and dates. Perhaps:
  - Use html as (optional) "dto". Requires beautifulSoup parsing server-side.
- Additional capabilities if same origin, e.g. sending blobs.
- Tighter integration with form parcel.
- Integrate with a lean reactive client state - perhaps residing in use.meta.
- Experiment with patterns for true background fetching (worker + reactive state) or pseudo background fetching (setTimeout or local worker).
- Take into account usage from iworker, in Anvil client-code and in Anvil-served docs (Views).
- Implement callback as in-argument as alt to `then` (relevant in an Anvil client-code context).
- Perhaps tighter integration with Anvil's user management and the `user` parcel.
- Perhaps integration with Vercel server functions to enable call of Anvil server functions... but consider if worthwhile given that server targets are already invocation agnostic.
- Experiment with alternatives to classic fetch, e.g.:
  - Module import where sent data is packed into a query, perhaps b64. Should hit server targets that serve modules with dynamic content - perhaps using Jinja2.
  - Stylesheet import where sent data is packed into a query, perhaps b64. Should hit server targets that stylesheet with dynamic content in the form of CSS vars - perhaps using Jinja2. Would require client-side work similar to the import engine's `@/` imports. Would circumvent CORS restrictions (for better or worse).
- Perhaps options to send non-text requests even when not same origin. Would not be zero pre-flight and would require seeting up server targets that support "OPTION", sp that access can be granted based on the pre-flight stage.
- Support for pseudo-sockets based on some variation of polling.
- Memoize - or relegate to a new data parcel.
- Automatic delegation to server call or call to data parcel.

# Reminders

Developing and debugging client-server integrations is notoriously gnarly, so be sure to set up local serves that enable testing without requirering commits for each iteration.

The future direction of this parcel depends very much on the direction(s) the dual-app concept takes.

## Scenarios

### 1. Server app as pure backend

This parcel would be THE client-server bridge, so need to go all-in with respect to getting the most out of non-same origin calls, incl. non-text requests and compensating for stateless by sending app state with each call. Would also require special love re user management - perhaps with a full or partial replacement of Anvil's user management.

### 2. Server app as iworker

Probably best to keep this parcel simple and reserved for simple requests. More complex client-server coms would take place inside the iworker, perhaps (primarily) based on Anvil rpc's. Shared "server state" could be made pseudo and actually reside in the iworker client code (if not super sensitive data).

### 3. Anvil app with active client code

Blocking server calls would be made with Anvil rpc's. The role of this parcel would be to deal with calls that run in the background (true or pseudo) and to deal with pseudo-sockets.

### 4. Anvil app as Flask-like MPA

While this parcel would indeed be the only client-server bridge, but it's use would likely be somewhat limited, since each page would be served fully hydrated. This parcel should be optimized for sending (custom) form data.

### Likely direction (as things stand now)

Option `3. Anvil app with active client code` with `4. Anvil app as Flask-like MPA` as a side-kick.
