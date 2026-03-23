# Rollo — CLAUDE.md

This document outines app concepts and how we work together. It's a live document and the content may be incomplete - so ask if in doubt.

If needed, do consult README.md docs as these may contain important explanatory info. `test` dirs can also serve as pseudo-documentation, but be aware that `test` dirs may contain obsolete code.

## 1. Purpose

This repo is the live source for the frontend part of Rollo — a personal toolbox of reusable utilities, components, and patterns for web development.

Rollo is not a framework. It's a curated set of tools designed to be composed and reused across different apps. Think of it as a living workshop rather than
a product — it evolves as new needs arise.

The goal is a "complete" toolbox for building SPAs with a companion backend (and potentially MPAs). Complete in the sense that it covers most of what's needed to build almost any app: an import engine, client-server communication, user management, reactivity, routing, UI components, and more.

## 2. Dual-app structure

Rollo is split across two repos:

- **Client (this repo, `E:/rollo/client`):** The frontend (or just 'the client app') — a Vite-powered
  SPA containing the import engine, UI components, routing, reactivity, and
  all other client-side tooling. Deployed to Vercel.
- **Anvil companion app (`E:/rollo/server`):** The server-side counterpart (or just 'the server app'), hosted on the Anvil platform. Provides HTTP endpoints, database, and user management. However, the server app is more than server-side stuff. The server app is embedded into the client as an iframe. The server app therefore has both a server side (or just 'the server') and a client side ('the iworker').

### Why the split?

Vercel is fast for serving static assets and works well as a source of "federated modules" that any app can consume. A standard GitHub repo with no size constraints. Anvil, while excellent for backend services and built-in user management, is slower for static asset delivery, has repo size limitations, and its repos are not true GitHub repos. The iworker provides the client app with access to:

- Non-cors-restricted http endpoints.
- Anvil server functions (rpc).
- Anvil's user management features.
- Anvil's "Python in the browser" for doing stuff where Python is better suited than JS.
  ... and other Anvil-features.

From the perspective of the cliet app, the iworker can also be thought of as a browser-aware and Python enabled iframe - or as a stateful pseudo-server with extended data transfer capabilities.

In general, the iworker is used by the client as an invisible iframe (height set 0; display none can trup up the Anvil app), but occasionally the iframe can become visible. This is especially relevant, if desired to use some of Anvil's special built-in modals, e.g., re user management and payments.

Moreover, the server-app can also be used as a "side-by-side" app with respect to the client app, i.e., the server-app can also operate independently (both as an SPS and an MPA) that the client app can link to and to a limited degree correspond with.

### How they connect

The client app builds to a main sheet (containing all styles + encoded parcel code) and the `use` engine, deployed to Vercel.

The server app has a `client_code` layer that:

- Pulls in the main sheet and `use` engine from Vercel. The client side of the server app therefore has access to the same import engine that the client app has and also extends the capabilities of the import engine. The server app also has it's own web platform assets (stuff in the `theme/assets` dir of the server app), often refered to as the server apps own assets. These assets (e.g., js and html) can also be given access to the import engine.

Using the import engine (as served by the client app) in the client side of the server app is almost seamless, but does involve some issues that needs to be carefully adressed. These issues include:

- Management of JS vs. Python types. Anvil's client-side Python is pretty good at handling JS stuff directly. That's mostly great, but can sometimes be deceptive. For example, it's possible to destructure a JS vanilla object directly into a Python callable with the `**` syntax, and in many cases we can use a JS vanilla object as if it were a dict... But attempts to, e.g., call `get()` of a vanilla JS object blows things up. Different strategies are used to deal with this, including:
  - Ensuring that the object in question is the expected type (e.g., JS vanilla object or dict) and then dealing with is accordingly.
  - Conversion of JS types to Python types.
    In general (but not 100% strictly) - to keep my sanity - lean towards the paradigm: In the client side of the server app everything should be Python, i.e., if JS types comes in it should be converted to Python types or at least be able to be used as-if Python types.
- Anvil's client-side Python sometimes incorrectly deals with JS stuff and special adapters must be written. Fortunately, this is rare, but when it happens things blow up. Notably, certain JS proxies are not handled correctly, e.g., the central `component` feature in the rollo parcel and also the `use` feature itself. In the client app, I trive to avoid making compromises just because consumption in Anvil trips things up, but in some cases multiple ways of doing things are accomodated with Anvil in mind.

The client app can correspond directly with the server app's server side, i.e., without goint through the iworker. Such coms are pretty fast (no pre-flight), but come with some important restrictions, e.g., no persistant state server-side, and only json-able stuff can be sent.

For the iworker concept to work, the client-side of the server app must be able to dynamically import packages. Anvil does not support this client-side, so the Python version of `use` implements this by extending the import engine with a `@@` prefix. The implementation is inspired by Vite's `glob`. It can be managed manually, but the server-app has a small build tool to help.

### Iworker security
The server app checks the client origin to prevent iframe-jacking. However, such checks are difficult when the client app is running in Vite's dev server. For this reasons, a local uplink server that serves a sepcial access server function is required, when in DEV. The same access mechanism is used for direct client app -> http endpoint coms.

## 3. Import engine, parcels, and build tooling

### The JS `use` import engine

`use` is a custom global import engine (source: `use/`). It provides dynamic imports with support for multiple asset types (JS, CSS, JSON, markdown) from
different sources. It is extensible via sources, types, transformers, and processors.

Usage pattern:
const { component } = await use("@/rollo/");
const { Form } = await use("@/form/");
const sheet = await use("@/my_parcel/shadow.css");

`use` is made global on `globalThis` — it's available everywhere without importing.

Key concepts:

- Path-based specifiers with source prefixes (e.g., `@/` for public assets)
- Sources: define where to fetch assets from (public, sheet, etc.)
- Transformers: convert raw content by file type (JS, CSS, JSON, markdown)
- Processors: post-process assets by compound type
- `use.add()`: injects/overloads assets — used in test harnesses to swap in live parcel code during development.

The custom build tool also exposes `use` itself publically so that it can be consumed by the server-app's client code (and own assets).

### Parcels

Parcels are Rollo's modularization system (source: `parcels/`). Each parcel is a self-contained Vite-powered library with its own source, build config,
and test harness. Parcels are consumed by the client app via the `use` engine — they do not affect the client app's JS bundle size.

Active parcel structure:

parcel-name/
├── index.html # Test harness entry
├── index.js # Public exports
├── package.json # Vite scripts
├── vite.config.js # Builds to client/public/parcels/ or client/assets/
├── use.js # Import engine init (DEV only)
├── src/ # Source code
├── assets/ # Built output
└── test/
├── test.js # Test runner (new-style run() pattern)
├── test.css
└── tests/
└── test.js # Individual test specs

Conventions:

- Parcels prefixed with `_` (e.g., `_accordion`) are INACTIVE — placeholders for future work or work in progress.
- Parcels can have `_`-prefixed dirs, e.g., `_history`. Such dirs are not part of the parcel per se.
- The `test` dir in parcels are also not part of the parcel per se, but does play a very important role for testing and indiretly as documentation.

### Build tooling

The build system is a custom Python tool (source: `build/`). It:

- Transpiles built parcel JS into asset-carrier sheets
- Aggregates built parcel CSS into a single main sheet
- Places copies of the main sheet and asset-carrier sheets into parcel `test/` dirs so that parcel tests can access other built parcels

The build does NOT rely on cascade ordering configuration. CSS should be written so it doesn't depend on rule order in the main sheet. For special
cases, use constructed sheets (for light/shadow DOM) or hard styling.

The build is run before deploying to Vercel. Individual parcels are built with `vite build` from within their directory.

## 4. General concepts and opinions

### Web platform first, JS first

Rollo leans heavily on native web platform features — custom elements, shadow DOM, constructed stylesheets, standard DOM APIs. The goal is to stay
close to the platform rather than abstracting it away. JavaScript is the primary language; no TypeScript.

While JS-first, a VS Code plugin intended for Lit (but not used for Lit) is used. This plugin enables linted authoring of html in JS. This open up many possibilities for creative use of html.

### Dependency philosophy

- The `rollo` parcel (the core toolbox) must remain zero-dependency, aside from dev tooling (Vite, Tailwind). This is a hard rule.
- Other parcels MAY wrap or use external npm packages. In fact, creating dedicated parcels for specific npm packages is encouraged — it ports the package into the asset-carrier system and avoids redundant inclusion across parcels.
- Examples of npm-wrapping parcels: `d3`, `plotly`, `marked`, `papa`, `bootstrap`, `yaml`.

### No established framework (mostly)

Rollo deliberately avoids depending on an established framework. The component system, reactivity, and routing are all custom-built.

React is perhaps an exception with an open question: There's interest in being able to tap into the React ecosystem, but React's direction towards meta
frameworks (Next.js, etc.) makes standalone integration harder. The jury is still out on React's role in Rollo. Don't assume React is or isn't part of the stack — ask first.

### UI layer: Tailwind + Bootstrap

UI-oriented parcels use Tailwind for utility classes and Bootstrap for component-level UI. Yes, Bootstrap is old-school, but in combination with
custom CSS, Tailwind, and web componentization, it remains a good choice. Don't suggest replacing Bootstrap.

The use of Bootstrap is also important inside the iworker, where Tailwind cannot be used directly.

### Vite

Vite is the standard build tool for all parcels — both for dev servers and production builds. Target is ES2022.

### Known limitation: Plotly

Plotly is a special case. Its source contains non-ASCII characters that prevent it from being packed as a standard parcel via the carrier sheet
system. Instead, the `plotly` parcel is a thin wrapper around a large JS file served directly from `client/public/`. This makes it the only
slow-loading parcel. The long-term approach is undecided:

- Find a way to handle non-ASCII in the import engine
- Create a lighter-weight Plotly subset
- Switch to Chart.js as Rollo's primary charting solution
- Accept the current approach

Don't try to "fix" the Plotly loading without discussing first.

An interesting question re Plotly lingers: Anvil does implement a version of Plotly. Therefore, with the iworker structure, we essentially have two implementations of Plotly. In principle, we just reply on using Anvil's Plotly, but that would be subject to only using Plotly inside the iworker in visisble mode. That is gnarly in itself (but can be done) but also means less controll over the Plotly.

## 5. Component approach

The `rollo` parcel is the core toolbox. Its component system has several
layers and two main approaches to building complex components.

### `component` — the workhorse

`component` is a Proxy-based factory (with a non-proxy version for consumption in Anvil) for creating non-autonomous web components on-the-fly from any native HTML tag:

const { component } = await use("@/rollo/");
const div = component.div(".my-class", { parent: frame }, "Hello");
const btn = component.button("btn btn-primary", { onclick: handler });

Each call registers a custom element (e.g., `x-div`), applies a standard set of mixins (DOM manipulation, events, styling, etc.), and returns a configured instance. This is the primary way to create UI elements in Rollo.

`component.from(html)` converts HTML strings into component trees.

### Standard component signature

Whether built via approach 1 or 2 below, a component should ideally be a capitalized function with a consistent signature:

- Class string (without dots if Tailwind), props, children, and hooks (hooks are a way to do additional setup inline)
- This gives a JSX-like feel to building component trees.

### Approach 1: Factory functions using `component`

A complex component can be a factory function (in its own module or parcel) that composes a tree using `component`. Interop between sub-components is
managed via:

- Events
- Dedicated reactive tools (`Reactive` / `Ref`)
- The built-in reactive state (`$`) that every Rollo component has

For cases where a factory-built component needs just one or two custom methods, the `mixup` utility can add them to an instance. Not memory-efficient, but justified in specific cases.

The per-component reactive state (`$` syntax) is a powerful feature that is probably underutilized at the moment and could play a bigger role.

### Approach 2: Dedicated web components with shadow DOM

For more complex components: author a dedicated web component class, ideally with shadow DOM for encapsulation. The `author` utility registers
the component and returns an instance factory.

The special `__new__` and `__init__` lifecycle methods overcome the usual constraints around building the tree in the constructor.

### Mixins — composable behavior

Components are built via mixin composition using `mix(base, config, ...mixins)`. The `rollo` parcel provides a rich set of standard mixins:
append, attrs, classes, clear, connect, data, detail, find, hook, insert, on, owner, parent, props, send, style, text, uid, vars, etc.

Higher-level parcels (e.g., `form`, `modal`) author their own autonomous web components by combining these mixins with custom logic.

### Reactivity — `Reactive` and `Ref`

The `rollo` parcel includes a custom reactivity system:

- `Reactive`: a reactive key-value store with an effects system. Supports conditional effects (by key array or predicate), computed values, silent
  updates, and a `$` Proxy for lean syntax.
- `Ref`: a single-value reactive container.
- Components integrate reactivity via the state mixin, enabling reactive properties and effect-driven DOM updates.

### Styling components

Multiple approaches coexist:

- **Light DOM sheets:** Primarily via Vite's CSS features (vanilla CSS imports, sometimes CSS modules). The import engine can also import link-based sheets dynamically and FOUC-free.
- **Shadow DOM sheets:** Constructed sheets, importable via the import engine. But the preferred approach is the `css` tagged template utility
  — a hijacked Lit CSS plugin that provides linted CSS directly in JS.
- **`css` utility:** Also useful beyond shadow DOM — for hard-styling and creating constructed sheets in JS, avoiding "string soup".
- **`html` tagged template:** Returns its interpolated string as-is. Its sole purpose is to trigger the VS Code `html` syntax highlighting plugin (intended for Lit) — without actually using Lit.

### `Sheet` — constructed stylesheets

`Sheet` extends `CSSStyleSheet` with controlled adoption to document or shadow roots, dynamic rule management, and enable/disable toggling. Used for both light DOM and shadow DOM styling.

### Flexibility is key

Both approaches (1 and 2) are valid. Shadow DOM is preferred for complex components but not mandatory. Don't assume one approach — ask first.

### The special `app` component

All components reside inside the top-level `app-component` (or just reffered to as `app`). The app component has special features that descendant component can use, e.g.,

- Resize observer
- Breakpoint tracking

The app component can be seen as a critical global along side `use`.

When used in Anvil, some hacks are done to ensure that even Anvil components reside inside the app component.

When implementing new features, it's a good idea to consider if the app component can be used - or the the app component should be given new features.

The app component is fundamental, so it resides in the rollo parcel.

### The special `frame` component

In practice (perhaps with some special exceptions), the app component only contains a single layout component, the `frame-app` component (or just reffered to as `frame`). In consequence, `frame` is effectively a descendant of all other components (except for `app` of course).

So why the `app`-`frame` split? A few reasons:

- `frame` "less fundamental" or purely about layout, whereas `app` serves a more logic purpose.
- The `frame` component relies on Bootstrap. Hence, being "dirty" (not zero-dep) it does not belong in the rollo parcel, but has it's own. In principle, should be open to special or future scenarions, where the rollo parcel can be used without the frame component.

When used in Anvil, we some hacks are done to implement the frame component inside an Anvil component. When Anvil is used as an iframe, the frame component is typically used as an empty visual layer to provide visual consistency with respect to the client app. However, if Anvil is used as a stand-alone app, the frame component (or the Anvil component that wraps it) is used as an actual layout component.







## 6. Server app's server code

The server app's server code does the main jobs:
- Routes to the server app's client-code packages
- Exposes a 'main' server function
- Exposes a 'main' http endpoint

Rather than writing many individual server functions and http endpoints the idea is that the server only exposes a single 'main' server function and a single 'main' http endpoint. These "mains" in turn "delegate" to name-based "psudo-endpoints" in such a way that these pseudo endpoint do necessarily care about whether they were invoked by the 'main' server function or the 'main' http endpoint.

It's possible that at a given point in time either the 'main' server function or the 'main' http endpoint is not available. When this happns it's likely because the missing piece has been temporarily been taken out due to major refactoring work.

Since the client app is served by Vercel, Vercel server function could also be in play. If so, it's like that such Vercel server function delegates to the server app. However this is currently experimental.

As for the routing part, typically the server router invokes an Anvil client_code package (`FormResponse`), but it's also possible that the server router invokes a "Flask-style" jinja view residing in the server apps' `theme/assets`. The later is not typical.


## 7. Directory structure and conventions

### Top-level structure

E:/rollo/client/
├── _history/ # Timestamped snapshots of previous code versions
├── _notes/ # Personal reference notes (markdown)
├── _reference/ # Reference code snippets
├── _scratch/ # Scratch/experimentation area
├── _stash/ # Stashed code (e.g., server_code copies)
├── build/ # Custom Python build tool
├── client/ # The Vite-powered client app (deployed to Vercel)
├── parcels/ # Parcel source directories
├── test/ # Top-level testing (Anvil integration, etc.)
├── use/ # The `use` import engine source
├── README.md
└── TODO.md


### `_history/` dirs

Found both at the top level (`_history/`) and inside individual parcels. These contain timestamped snapshots of previous code versions — a lightweight way to keep important prior versions within reach without relying solely on git history. Do not modify or delete history folders. The top-level `_history/` dir also contains a `server` subdir, which in turn contains a `client_code` and a `server_code` dirs. These dirs contains stuff related to the server app, placed there to take the pressure of the Anvil repo (which has a size limit). The server-app may also have a top-level `_history/` dir, but that is gitignored and - if present - just there for legacy reasons.

Typically, stuff inside `_history/` dirs (top-level and parcels) should be ignored. BUT it can be instructive (e.g., for debugging or for inspiration) to peek inside. However, be a aware that stuff inside may not work or may be obsolete!

### The `client/` directory

The actual Vite app deployed to Vercel:

client/
├── src/ # App source (main entry, CSS, use init)
├── public/ # Static assets (built parcels, tools)
├── api/ # Vercel serverless functions (if any)
├── templates/ # HTML templates
├── test/ # Tests, primarily re the server app
├── use/ # Import engine
├── index.html # App entry point
├── vite.config.js
└── vercel.json # Vercel deployment config

There also a `server` dir. It's currently empty, but it's there in prep for a potential future use a of a FastAPI server.

## 8. Testing approach

### Parcel-level testing

Each active parcel has its own test harness. During development:

1. Run `npm run dev` from within the parcel directory
2. Open the browser (typically http://localhost:5173)
3. The test harness loads via `index.html` → `test/test.js`
4. Press **Shift+U** to select and run a test by path (e.g., `/basics.test.js`)
5. The last test path is cached in localStorage for quick re-runs

Test files live in `test/tests/` with the `.test.js` extension. Each test exports a default async function that renders into the DOM:

export default async () => {
frame.clear(":not([slot])");
// build and test components here
};

Tests are visual and interactive — they render real components in the browser, not headless assertions. Verification is done by looking at the result.

### Test harness conventions for parcels

- Test harnesses use `use.add()` to overload the parcel's asset path with the live (non-built) parcel code, enabling hot-reload during development. Other parcels are available in their built versions.
- The harness sets `data-bs-theme="dark"` by default.
- Test CSS uses Tailwind (`@import "tailwindcss"`).
- The test harnesses across parcels are intentionally near-identical rather than centralized. This unDRYness is accepted to maintain flexibility.

### Bundle safety

Test files and test-only code must NEVER hit the production bundle. Vite configs use `rollupOptions.external` to exclude test paths.
The one accepted exception: Tailwind classes used in test files will spill into the main sheet — this is fine since there's likely parity with actual code, and a little redundant CSS is acceptable.

### Main app test harness

The client app (`client/test/`) has its own test harness, similar to the parcel harnesses. Key difference: the main app harness tests BUILT parcels (and non-parcel code). Use it for:

- Testing how built parcels interact with each other
- Verifying that a built parcel behaves the same as the unbuilt version

### Anvil integration testing

Anvil does not provide a test server to run locally (at least not one, I've been able to make work). We therefore need creative ways to test Anvil code without the need to commit. The core principle is to spin up (sometimes multiple concurrent) local uplink servers - that serve endpoints with diferent purposes.

The `test/` dir contains the subdirs `client_code` and `server_code` and the `access.py` file.

#### Server app client code testing

The server app has a `/test` route residing in `client_code/test` (if needed check out the code). This route mimics the test harness for parcels.

Let's go over some scenarios to explain...

"Wish to test a given client_code package":

- Run `test/client_code/test.py`
- Use the test harness in the Anvil test route (`https://rollohdev.anvil.app/test`)

"Wish to run tests with a non-comitted version of a given client_code package":

- Run `test/client_code/package.py`
- Use the test harness in the Anvil test route (`https://rollohdev.anvil.app/test`)

#### Server app server code testing

Currently work in progress, but somewhat same principles as for client code testing although not based of "text-to-code".

Also experimenting with a light-weight "in server app repo" test harness, residing in `test_code` (in the server app repo), but that's very much experimental.

The special `test/server_code/log.py` allows me to print messages from server_code.

### The test harness is not limited to visual unit tests

While the primary use is visual unit testing, test files can be as elaborate as needed — including automated testing patterns. The test
harness is flexible by design.

### Tests are disposable and safe

Test files never hit any bundle. This means tests are a safe space to:

- Experiment freely and "go crazy"
- Document the current state of the toolbox through working examples
- Leave old or uncurrent tests around without harm

Tests serve as living documentation when maintained, but stale tests are not a problem — they just sit there inertly. Never worry about
cleaning up tests as a prerequisite for building or deploying, but of course I do occasionally clean up stale tests.

## 9. Code style

### General

- ES modules throughout. No CommonJS.
- Modern JS (ES2022+). Use latest features freely — optional chaining, nullish coalescing, private class fields, top-level await, etc.
- No TypeScript. Plain JavaScript only.
- Semicolons are required. Missing ones are oversights. Especially important given heavy use of IIFEs.
- `const` is strongly preferred over `let`. Use IIFEs and other patterns to avoid `let` where possible — `const` feels more declarative. `let` is acceptable where it truly makes more sense (e.g., the `use` engine).

### Comments

- `/* */` for documentation-like comments that should survive Vite minification — interface descriptions, return types, usage notes.
- `//` for disposable "comment comments" — notes to self, temporary explanations, debugging. These get stripped by Vite.
- Use Python-style prefixes: `NOTE`, `BUT`, `XXX` to mark comment intent.
- No JSDoc.

### The `#_ = {}` pattern

All private state is bundled into a single `#_` object:

class Foo { #_ = {};
constructor() {
this.#_.bar = "something";
}
get bar() {
return this.#_.bar;
}
}

This provides:

- Clean symmetry between public and private (`this.foo` / `this.#_.foo`)
- Easy sharing of private state between compositions
- Lazy initialization (`this.#_.foo` is meaningful without declaration)
- Mirrors the Python convention: `self._ = {}` with `self._.get('foo')`

### Classes over plain objects

Prefer classes even when a plain object might suffice. This gives consistency and easier refactoring.

- **Singletons:** use anonymous class instances: `new (class { ... })()`
- **Composition classes:** define outside the constructor. The composition class receives `owner` and/or the owner's `#_` via its constructor. Legacy code may still have compositions inlined in constructors exploiting closures — that's understood but not the direction forward.
- **IIFEs with classes:** used freely for scoping and to maintain `const`.

### Static `create` pattern

Classes often provide a `static create = (...args) => new Cls(...args)` as an alternative constructor. Sometimes `create` has special logic, but
typically it's just a wrapper around `new`. The reason: using `new` in Anvil's client_code (Skulpt) requires an ugly function wrapper syntax and explicit import. `create` provides a cleaner call site. Follow this pattern for new classes.

### Naming

- **lowercase** for singletons and utility instances: `component`, `is`, `pipe`, `modal`
- **Uppercase** for classes and factory functions: `Reactive`, `Sheet`, `Spinner`, `Form`
- **Dual variants** (e.g., `component`/`Component`, `ref`/`Ref`):
  the lowercase version is typically a Proxy with compact syntax, while the uppercase version is a more conventional implementation. This
  provides syntactic alternatives and also mitigates Skulpt/Proxy compatibility issues in Anvil's client_code.

### File naming

Always lowercase, snake_case for file names: `tagged_sets.js`, `my_component.js`. Never camelCase or PascalCase for files.

### Flexible function signatures

Functions often use a `...args` signature with manual parsing:

const foo = (...args) => {
const options = args.find((a) => is.object(a)) || {};
const callback = args.find((a) => is.function(a));
args = args.filter((a) => !is.object(a) && !is.function(a));
// ...
};

This provides flexible call-site ergonomics — callers can pass arguments in any order and omit what they don't need.

### Function parameters are mutable

While `const` is preferred everywhere else, function parameters are `let`-like by nature and it's fine to reassign them:

const foo = (...args) => {
args = args.filter((a) => typeof a === "string");
// ...
};

### Proxy usage

Proxies are used extensively for ergonomic APIs (`component`, `use`, `Spinner`, `Reactive.$`, `on`, etc.). This is a core pattern — don't
simplify or remove Proxy usage unless asked.

### Philosophy: elegant innovation

The code gravitates towards modern, canonical JS — but deliberately pushes boundaries when the result is elegant and efficient. Examples:

- `Exception.if(predicate, message)` — using `if` as a method name
- Proxy-based APIs for ergonomic syntax (`component.div`, `use()`, `$`)
- Hijacking Lit's `html` and `css` plugins for syntax highlighting without using Lit
- Encoding JS in CSS carrier sheets as an asset delivery mechanism
- Potential future directions: using HTML/components as alternatives to nested object/array structures (serializable, rich DOM APIs), non-visual web components as data structures, and even responsible built-in prototype augmentation

The mindset: Write really good code, but challenge conventions when there's a defensible, elegant reason. Break the rules responsibly.

When working together: don't shy away from unconventional approaches if they fit the Rollo style. But equally, don't introduce weird patterns without justification — the goal is elegance, not cleverness for its own sake.

### Python conventions (companion app)

- `self._ = {}` (sometimes `self.__ = {}`) mirrors the JS `#_ = {}` pattern for private state 
- Mutable containers used to avoid `global`/`nonlocal` (especially since Skulpt doesn't support `nonlocal`)
- Singleton pattern: define a class with `__call__`, then immediately replace the name with an instance (`foo = foo()`). Provides encapsulation and super-charged callables.
- `NOTE`, `BUT`, `XXX` comment prefixes (same as JS)

## 10. What NOT to do

### Code changes

- Do NOT refactor existing code unless explicitly asked
- Do NOT change the Proxy-based API patterns — they are intentional
- Do NOT simplify or "clean up" patterns that look unconventional — they are likely deliberate (e.g., `Exception.if`, `#_ = {}`, anonymous class ingletons, `...args` parsing)
- Do NOT modify files outside the scope of what was asked for
- Do NOT modify or delete `_history/` dirs
- Do NOT change the `rollo` parcel's zero-dependency rule

### Style

- Do NOT add TypeScript
- Do NOT add JSDoc
- Do NOT use `let` where `const` with an IIFE would work
- Do NOT use camelCase or PascalCase for file names
- Do NOT introduce plain objects where a class would be more consistent
- Do NOT use `//` comments for documentation that should survive minification — use `/* */`

### Tooling

- Do NOT suggest replacing Bootstrap — it's a deliberate choice
- Do NOT suggest replacing the `use` engine with standard imports
- Do NOT suggest established frameworks (React, Vue, etc.) as replacements for Rollo's custom systems
- Do NOT try to "fix" the Plotly loading without discussing first
- Do NOT suggest centralizing/DRYing the per-parcel test harnesses

### Workflow

- Do NOT commit on `main` — work in the session worktree (NOT used)
- Do NOT push to any remote without explicit permission
- Do NOT create README or documentation files unless asked
- Do NOT make changes outside the session worktree directory
- Do NOT promote test code to `src/` without approval — tests are the staging ground, promotion is a deliberate step

### Dependencies

- Do NOT add npm dependencies to the `rollo` parcel 
- Do NOT add dependencies without discussing first — Rollo is intentionally lean
- Do NOT import from `node_modules` in the `rollo` parcel source

### Bundle safety

- Do NOT let test files or test-only code leak into production bundles
- Do NOT create imports from `test/` in `src/` files

## 11. Working agreement

### How we collaborate

In general (unless specifically asked to do otherwise):
- Re refactoring existing parcels: ONLY create stuff in test dirs 
- Re new parcels: Create parcels with a `_` prefix.

For the server app, TBD how to collab, so currently do NOT make any changes to the server app repo - other than perhaps in `test_code`

### Communication style

- Explain what you want in plain language
- Point me to specific parcels or files when you can
- Tell me whether to investigate or make changes
- Flag when something is experimental vs production-ready
- I'll ask before making architectural decisions
- I'll flag open questions rather than guessing

### The companion app

I can read the Anvil companion app at `E:/rollo/server` whenever a parcel's server-side contract matters. You don't need to paste code into the chat — just point me there.

### Server app collaboration

For work that touches the companion app, I write directly in
`E:/rollo/server/test_code/` — a completely safe staging area where code never enters the actual app.
AND/OR in `tests` (ask first).



