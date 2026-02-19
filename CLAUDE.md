# Rollo — CLAUDE.md

## 1. Purpose

This repo is the live source for the frontend part of Rollo — a personal
toolbox of reusable utilities, components, and patterns for web development.

Rollo is not a framework. It's a curated set of tools designed to be composed
and reused across different apps. Think of it as a living workshop rather than
a product — it evolves as new needs arise.

The goal is a "complete" toolbox for building SPAs with a companion backend
(and potentially MPAs in the future). Complete in the sense that it covers
most of what's needed to build almost any app: an import engine, client-server
communication, user management, reactivity, routing, UI components, and more.

## 2. Dual-app structure

Rollo is split across two repos:

- **Client (this repo, `E:/rollo/client`):** The frontend — a Vite-powered
  SPA containing the import engine, UI components, routing, reactivity, and
  all other client-side tooling. Deployed to Vercel.
- **Anvil companion app (`E:/rollo/server`):** The server-side counterpart,
  hosted on the Anvil platform. Provides HTTP endpoints, database, and
  user management.

### Why the split?

Vercel is fast for serving static assets and works well as a source of
"federated modules" that any app can consume. A standard GitHub repo with
no size constraints. Anvil, while excellent for backend services and
built-in user management, is slower for static asset delivery, has repo
size limitations, and its repos are not true GitHub repos.

### How they connect

The client builds to a main sheet (containing all styles + encoded parcel
code) and the `use` engine, deployed to Vercel.

The Anvil app has a thin `client_code` layer that:
- Pulls in the main sheet and `use` engine from Vercel
- Approximately mirrors the Vercel-deployed app
- Adds Anvil-native user management (same-origin, avoiding CORS/cookie
  complexity)
- Extends the `use` engine to import `client_code` Python packages and
  access Anvil server functions

In practice, the Anvil-hosted app is what end users interact with, while
the heavy lifting (components, routing, reactivity, etc.) comes from the
Rollo toolbox served via Vercel.

### CORS and local development

The Anvil backend checks the frontend app's origin for CORS. When running
in DEV mode, a special local server grants localhost request origin access.

### Parcels with backend dependencies

Some parcels depend on the Anvil backend to function fully — notably
`server` (client-server communication) and `user` (authentication flows).
When working on such parcels, refer to the companion app's code directly:
- `E:/rollo/server/server_code` — backend endpoints
- `E:/rollo/server/client_code` — Anvil-side integration layer

### Open question: DEV vs PROD parity for Anvil-dependent parcels

Some parcels (e.g., `user`) are currently designed to work both in
standalone DEV mode and in Anvil-deployed production. This is convenient
for local testing but requires maintaining two code paths depending on
the environment. The long-term approach is undecided:
- The DEV path could evolve to become good enough to be the only path
- Or Anvil-dependent parcels could drop standalone DEV mode entirely
  and only run from Anvil

This is a design tension, not a bug. When working on Anvil-dependent
parcels, be aware that both paths exist and don't assume one will go away.

## 3. Import engine, parcels, and build tooling

### The `use` import engine

`use` is a custom global import engine (source: `use/`). It provides dynamic
imports with support for multiple asset types (JS, CSS, JSON, markdown) from
different sources. It is extensible via sources, types, transformers, and
processors.

Usage pattern:
  const { component } = await use("@/rollo/");
  const { Form } = await use("@/form/");
  const sheet = await use("@/my_parcel/shadow.css");

`use` is made global on `globalThis` — it's available everywhere without
importing. In DEV mode, `use` is writable/configurable to allow overloading
when testing parcels.

Key concepts:
- Path-based specifiers with source prefixes (e.g., `@/` for public assets)
- Sources: define where to fetch assets from (public, sheet, etc.)
- Transformers: convert raw content by file type (JS, CSS, JSON, markdown)
- Processors: post-process assets by compound type
- `use.add()`: injects/overloads assets — used in test harnesses to swap
  in live parcel code during development

### Parcels

Parcels are Rollo's modularization system (source: `parcels/`). Each parcel
is a self-contained Vite-powered library with its own source, build config,
and test harness. Parcels are consumed by the client app via the `use`
engine — they do not affect the client app's JS bundle size.

Active parcel structure:
  parcel-name/
  ├── index.html        # Test harness entry
  ├── index.js          # Public exports
  ├── package.json      # Vite scripts
  ├── vite.config.js    # Builds to client/public/parcels/ or client/assets/
  ├── use.js            # Import engine init (DEV only)
  ├── src/              # Source code
  ├── assets/           # Built output
  └── test/
      ├── test.js       # Test runner (new-style run() pattern)
      ├── test.css
      └── tests/
          └── *.test.js # Individual test specs

Conventions:
- Parcels prefixed with `_` (e.g., `_accordion`) are INACTIVE — placeholders
  for future work. Ignore them. They reflect an older structure and will be
  reshaped when activated.
- Active parcels follow the new-style pattern (see `form`, `modal`, `router`
  as reference).
- Each parcel can have a `history/` folder containing timestamped snapshots
  of previous versions (a lightweight way to keep important prior versions
  within reach).

### Build tooling

The build system is a custom Python tool (source: `build/`). It:
- Transpiles built parcel JS into asset-carrier sheets
- Aggregates built parcel CSS into a single main sheet
- Places copies of the main sheet and asset-carrier sheets into parcel
  `test/` dirs so that parcel tests can access other built parcels

The build does NOT rely on cascade ordering configuration. CSS should be
written so it doesn't depend on rule order in the main sheet. For special
cases, use constructed sheets (for light/shadow DOM) or hard styling.

The build is run before deploying to Vercel. Individual parcels are built
with `vite build` from within their directory.

## 4. General concepts and opinions

### Web platform first, JS first

Rollo leans heavily on native web platform features — custom elements,
shadow DOM, constructed stylesheets, standard DOM APIs. The goal is to stay
close to the platform rather than abstracting it away. JavaScript is the
primary language; no TypeScript.

### Dependency philosophy

- The `rollo` parcel (the core toolbox) must remain zero-dependency, aside
  from dev tooling (Vite, Tailwind). This is a hard rule.
- Other parcels MAY wrap or use external npm packages. In fact, creating
  dedicated parcels for specific npm packages is encouraged — it ports the
  package into the asset-carrier system and avoids redundant inclusion
  across parcels.
- Examples of npm-wrapping parcels: `d3`, `plotly`, `marked`, `papa`,
  `bootstrap`, `yaml`.

### No established framework (mostly)

Rollo deliberately avoids depending on an established framework. The
component system, reactivity, and routing are all custom-built.

React is an exception with an open question: there's interest in being
able to tap into the React ecosystem, but React's direction towards meta
frameworks (Next.js, etc.) makes standalone integration harder. The jury
is still out on React's role in Rollo. Don't assume React is or isn't
part of the stack — ask first.

### UI layer: Tailwind + Bootstrap

UI-oriented parcels use Tailwind for utility classes and Bootstrap for
component-level UI. Yes, Bootstrap is old-school, but in combination with
custom CSS, Tailwind, and web componentization, it remains a good choice.
Don't suggest replacing Bootstrap.

### Vite

Vite is the standard build tool for all parcels — both for dev servers
and production builds. Target is ES2022.

### Known limitation: Plotly

Plotly is a special case. Its source contains non-ASCII characters that
prevent it from being packed as a standard parcel via the carrier sheet
system. Instead, the `plotly` parcel is a thin wrapper around a large JS
file served directly from `client/public/`. This makes it the only
slow-loading parcel. The long-term approach is undecided:
- Find a way to handle non-ASCII in the import engine
- Create a lighter-weight Plotly subset
- Switch to Chart.js as Rollo's primary charting solution
- Accept the current approach

Don't try to "fix" the Plotly loading without discussing first.

## 5. Component approach

The `rollo` parcel is the core toolbox. Its component system has several
layers and two main approaches to building complex components.

### `component` — the workhorse

`component` is a Proxy-based factory for creating non-autonomous web
components on-the-fly from any native HTML tag:

  const { component } = await use("@/rollo/");
  const div = component.div(".my-class", { parent: frame }, "Hello");
  const btn = component.button("btn btn-primary", { onclick: handler });

Each call registers a custom element (e.g., `x-div`), applies a standard
set of mixins (DOM manipulation, events, styling, etc.), and returns a
configured instance. This is the primary way to create UI elements in Rollo.

`component.from(html)` converts HTML strings into component trees.

### Standard component signature

Whether built via approach 1 or 2 below, a component should ideally be
a capitalized function with a consistent signature:
- Class string (without dots if Tailwind), props, children, and hooks
  (hooks are a way to do additional setup inline)
- This gives a JSX-like feel to building component trees

### Approach 1: Factory functions using `component`

A complex component can be a factory function (in its own module or parcel)
that composes a tree using `component`. Interop between sub-components is
managed via:
- Events
- Dedicated reactive tools (`Reactive` / `Ref`)
- The built-in reactive state (`$`) that every Rollo component has

For cases where a factory-built component needs just one or two custom
methods, the `mixup` utility can add them to an instance. Not memory-
efficient, but justified in specific cases.

The per-component reactive state (`$` syntax) is a powerful feature that
is probably underutilized at the moment and could play a bigger role.

### Approach 2: Dedicated web components with shadow DOM

For more complex components: author a dedicated web component class,
ideally with shadow DOM for encapsulation. The `author` utility registers
the component and returns an instance factory.

The special `__new__` and `__init__` lifecycle methods overcome the usual
constraints around building the tree in the constructor.

### Mixins — composable behavior

Components are built via mixin composition using `mix(base, config,
...mixins)`. The `rollo` parcel provides a rich set of standard mixins:

  append, attrs, classes, clear, connect, data, detail, find, hook,
  insert, on, owner, parent, props, send, style, text, uid, vars, etc.

Higher-level parcels (e.g., `form`, `modal`) author their own autonomous
web components by combining these mixins with custom logic.

### Reactivity — `Reactive` and `Ref`

The `rollo` parcel includes a custom reactivity system:

- `Reactive`: a reactive key-value store with an effects system. Supports
  conditional effects (by key array or predicate), computed values, silent
  updates, and a `$` Proxy for lean syntax.
- `Ref`: a single-value reactive container.
- Components integrate reactivity via the state mixin, enabling reactive
  properties and effect-driven DOM updates.

### Styling components

Multiple approaches coexist:

- **Light DOM sheets:** Primarily via Vite's CSS features (vanilla CSS
  imports, sometimes CSS modules). The import engine can also import
  link-based sheets dynamically and FOUC-free.
- **Shadow DOM sheets:** Constructed sheets, importable via the import
  engine. But the preferred approach is the `css` tagged template utility
  — a hijacked Lit CSS plugin that provides linted CSS directly in JS.
- **`css` utility:** Also useful beyond shadow DOM — for hard-styling and
  creating constructed sheets in JS, avoiding "string soup".
- **`html` tagged template:** Returns its interpolated string as-is. Its
  sole purpose is to trigger the VS Code `html` syntax highlighting plugin
  (intended for Lit) — without actually using Lit.

### `Sheet` — constructed stylesheets

`Sheet` extends `CSSStyleSheet` with controlled adoption to document or
shadow roots, dynamic rule management, and enable/disable toggling.
Used for both light DOM and shadow DOM styling.

### Flexibility is key

Both approaches (1 and 2) are valid. Shadow DOM is preferred for complex
components but not mandatory. Don't assume one approach — ask first.
Additional details should go in `parcels/rollo/CLAUDE.md`.

## 6. Directory structure and conventions

### Top-level structure

  E:/rollo/client/
  ├── _history/         # Timestamped snapshots of previous code versions
  ├── _notes/           # Personal reference notes (markdown)
  ├── _reference/       # Reference code snippets
  ├── _scratch/         # Scratch/experimentation area
  ├── _stash/           # Stashed code (e.g., server_code copies)
  ├── build/            # Custom Python build tool
  ├── client/           # The Vite-powered client app (deployed to Vercel)
  ├── parcels/          # Parcel source directories
  ├── test/             # Top-level testing (Anvil integration, etc.)
  ├── use/              # The `use` import engine source
  ├── README.md
  └── TODO.md

### `_` prefix convention

Directories prefixed with `_` are non-active or auxiliary:

- **Top-level `_` dirs** (`_history`, `_notes`, `_scratch`, `_stash`,
  `_reference`): personal workspace directories — not part of the app.
  Ignore unless specifically asked.
- **`_` prefixed parcels** (e.g., `_accordion`, `_dropdown`): inactive
  placeholders for future work. They reflect an older structure and will
  be reshaped when activated. Ignore them.

### `history/` folders

Found both at the top level (`_history/`) and inside individual parcels
(e.g., `parcels/rollo/history/`). These contain timestamped snapshots
(format: `YYYYMMDD`) of previous code versions — a lightweight way to
keep important prior versions within reach without relying solely on git
history. Do not modify or delete history folders.

### Inside a parcel

Active parcels follow this structure:

  parcel-name/
  ├── index.html        # Test harness entry
  ├── index.js          # Public exports
  ├── package.json      # Vite scripts
  ├── vite.config.js    # Build config
  ├── use.js            # Import engine init (DEV only)
  ├── src/              # Source code
  ├── assets/           # Built output
  ├── history/          # Optional: timestamped snapshots
  └── test/
      ├── test.js       # Test runner (new-style run() pattern)
      ├── test.css
      └── tests/
          └── *.test.js # Individual test specs

### The `client/` directory

The actual Vite app deployed to Vercel:

  client/
  ├── src/              # App source (main entry, CSS, use init)
  ├── public/           # Static assets (built parcels, tools)
  ├── api/              # Vercel serverless functions (if any)
  ├── templates/        # HTML templates
  ├── test/             # Client-level tests
  ├── index.html        # App entry point
  ├── vite.config.js
  └── vercel.json       # Vercel deployment config

## 7. Testing approach

### Parcel-level testing (primary)

Each active parcel has its own test harness. During development:

1. Run `npm run dev` from within the parcel directory
2. Open the browser (typically http://localhost:5173)
3. The test harness loads via `index.html` → `test/test.js`
4. Press **Shift+U** to select and run a test by path
   (e.g., `/basics.test.js`)
5. The last test path is cached in localStorage for quick re-runs

Test files live in `test/tests/` with the `.test.js` extension. Each
test exports a default async function that renders into the DOM:

  export default async () => {
    frame.clear(":not([slot])");
    // build and test components here
  };

Tests are visual and interactive — they render real components in the
browser, not headless assertions. Verification is done by looking at
the result.

### Test harness conventions

- Test harnesses use `use.add()` to overload the parcel's asset path
  with the live (non-built) parcel code, enabling hot-reload during
  development. Other parcels are available in their built versions.
- The harness sets `data-bs-theme="dark"` by default.
- Test CSS uses Tailwind (`@import "tailwindcss"`).
- Follow the new-style `run()` pattern (see `form` or `modal` as
  reference). Do not use the older `setup()` pattern.
- The test harnesses across parcels are intentionally near-identical
  rather than centralized. This unDRYness is accepted to maintain
  flexibility.

### Bundle safety

Test files and test-only code must NEVER hit the production bundle.
Vite configs use `rollupOptions.external` to exclude test paths.
The one accepted exception: Tailwind classes used in test files will
spill into the main sheet — this is fine since there's likely parity
with actual code, and a little redundant CSS is acceptable.

### Main app test harness

The client app (`client/test/`) has its own test harness, similar to
the parcel harnesses. Key difference: the main app harness tests BUILT
parcels (and non-parcel code). Use it for:
- Testing how built parcels interact with each other
- Verifying that a built parcel behaves the same as the unbuilt version

### Anvil integration testing

Some parcels (e.g., `user`, `server`) and client_code features require
the Anvil backend to test fully. This repo includes tooling for that:

`test/client_code/test.py` spins up a local uplink server that serves
test files (JS and Python) to the companion app. The workflow:

1. Run `test/client_code/test.py` locally
2. Visit `rollohdev.anvil.app/test` in the browser
3. The companion app's `/test` route loads the locally served test files
4. Use Shift+U as usual to select and run tests

This allows testing client_code changes without committing to the Anvil
repo. The test tooling lives in this repo (not the companion app) to
keep tests somewhat centralized and to avoid Anvil's repo size limits.

### Server-code testing (companion app repo)

Server-side code (server_code) has its own test harness in the companion
app at `E:/rollo/server/test_code/`. This lives in the companion repo
because it directly imports and runs server_code modules.

The test_code directory has two main parts:

**`servers/`** — scripts for spinning up local servers:
- `main.py` — exposes all existing endpoints as-is (for debugging
  committed code without changing it)
- Individual endpoint scripts (e.g., `echo.py`) — serve custom or
  modified endpoints that overwrite committed versions. This allows
  prototyping new endpoints or refactoring existing ones without
  committing.
- `tools/` — shared utilities (bootstrap, connect with auto-access,
  api/Api re-exports from server_code)

**`clients/`** — scripts for testing endpoints from the client side:
- Organized by endpoint name (e.g., `clients/echo/`)
- `.py` files — test via Anvil's RPC system (uplink with client key)
- `.html` files — test via HTTP request (browser-based, using the
  Vercel-deployed `use` engine and `server` parcel)

This provides two testing axes (serve × call) and two protocols
(RPC via Python callable × HTTP via browser fetch).

Key benefits:
- Test and iterate on server-side code without committing
- Print statements work reliably (unlike Anvil's logs)
- Since the companion app is already a DEV environment, running tests
  does not interfere with production code
- The directory is a completely safe staging area — code here never
  enters the actual app

### The test harness is not limited to visual unit tests

While the primary use is visual unit testing, test files can be as
elaborate as needed — including automated testing patterns. The test
harness is flexible by design.

### Tests are disposable and safe

Test files never hit any bundle. This means tests are a safe space to:
- Experiment freely and "go crazy"
- Document the current state of the toolbox through working examples
- Leave old or uncurrent tests around without harm

Tests serve as living documentation when maintained, but stale tests
are not a problem — they just sit there inertly. Never worry about
cleaning up tests as a prerequisite for building or deploying.

### When working together

Our agreed workflow: I write `.test.js` files in the relevant parcel's
`test/tests/` directory. You run the dev server, visually verify, and
tell me what to adjust. Once solid, we promote code to `src/`.

## 8. Code style

### General

- ES modules throughout. No CommonJS.
- Modern JS (ES2022+). Use latest features freely — optional chaining,
  nullish coalescing, private class fields, top-level await, etc.
- No TypeScript. Plain JavaScript only.
- Semicolons are required. Missing ones are oversights. Especially
  important given heavy use of IIFEs.
- `const` is strongly preferred over `let`. Use IIFEs and other patterns
  to avoid `let` where possible — `const` feels more declarative.
  `let` is acceptable where it truly makes more sense (e.g., the `use`
  engine).

### Comments

- `/* */` for documentation-like comments that should survive Vite
  minification — interface descriptions, return types, usage notes.
- `//` for disposable "comment comments" — notes to self, temporary
  explanations, debugging. These get stripped by Vite.
- Use Python-style prefixes: `NOTE`, `BUT`, `XXX` to mark comment intent.
- No JSDoc.

### The `#_ = {}` pattern

All private state is bundled into a single `#_` object:

  class Foo {
    #_ = {};
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

Prefer classes even when a plain object might suffice. This gives
consistency and easier refactoring.

- **Singletons:** use anonymous class instances: `new (class { ... })()`
- **Composition classes:** define outside the constructor. The composition
  class receives `owner` and/or the owner's `#_` via its constructor.
  Legacy code may still have compositions inlined in constructors
  exploiting closures — that's understood but not the direction forward.
- **IIFEs with classes:** used freely for scoping and to maintain `const`.

### Static `create` pattern

Classes often provide a `static create = (...args) => new Cls(...args)`
as an alternative constructor. Sometimes `create` has special logic, but
typically it's just a wrapper around `new`. The reason: using `new` in
Anvil's client_code (Skulpt) requires an ugly function wrapper syntax
and explicit import. `create` provides a cleaner call site. Follow this
pattern for new classes.

### Naming

- **lowercase** for singletons and utility instances: `component`, `is`,
  `pipe`, `modal`
- **Uppercase** for classes and factory functions: `Reactive`, `Sheet`,
  `Spinner`, `Form`
- **Dual variants** (e.g., `component`/`Component`, `ref`/`Ref`):
  the lowercase version is typically a Proxy with compact syntax, while
  the uppercase version is a more conventional implementation. This
  provides syntactic alternatives and also mitigates Skulpt/Proxy
  compatibility issues in Anvil's client_code.

### File naming

Always lowercase, snake_case for file names: `tagged_sets.js`,
`my_component.js`. Never camelCase or PascalCase for files.

### Flexible function signatures

Functions often use a `...args` signature with manual parsing:

  const foo = (...args) => {
    const options = args.find((a) => is.object(a)) || {};
    const callback = args.find((a) => is.function(a));
    args = args.filter((a) => !is.object(a) && !is.function(a));
    // ...
  };

This provides flexible call-site ergonomics — callers can pass
arguments in any order and omit what they don't need.

### Function parameters are mutable

While `const` is preferred everywhere else, function parameters are
`let`-like by nature and it's fine to reassign them:

  const foo = (...args) => {
    args = args.filter((a) => typeof a === "string");
    // ...
  };

### Proxy usage

Proxies are used extensively for ergonomic APIs (`component`, `use`,
`Spinner`, `Reactive.$`, `on`, etc.). This is a core pattern — don't
simplify or remove Proxy usage unless asked.

### Philosophy: elegant innovation

The code gravitates towards modern, canonical JS — but deliberately
pushes boundaries when the result is elegant and efficient. Examples:

- `Exception.if(predicate, message)` — using `if` as a method name
- Proxy-based APIs for ergonomic syntax (`component.div`, `use()`, `$`)
- Hijacking Lit's `html` and `css` plugins for syntax highlighting
  without using Lit
- Encoding JS in CSS carrier sheets as an asset delivery mechanism
- Potential future directions: using HTML/components as alternatives
  to nested object/array structures (serializable, rich DOM APIs),
  non-visual web components as data structures, and even responsible
  built-in prototype augmentation

The mindset: write really good code, but challenge conventions when
there's a defensible, elegant reason. Break the rules responsibly.

When working together: don't shy away from unconventional approaches
if they fit the Rollo style. But equally, don't introduce weird
patterns without justification — the goal is elegance, not cleverness
for its own sake.

### Python conventions (companion app)

- `self._ = {}` mirrors the JS `#_ = {}` pattern for private state
- Mutable containers used to avoid `global`/`nonlocal` (especially
  since Skulpt doesn't support `nonlocal`)
- Singleton pattern: define a class with `__call__`, then immediately
  replace the name with an instance (`foo = foo()`). Provides
  encapsulation and super-charged callables.
- `NOTE`, `BUT`, `XXX` comment prefixes (same as JS)

## 9. What NOT to do

### Code changes
- Do NOT refactor existing code unless explicitly asked
- Do NOT change the Proxy-based API patterns — they are intentional
- Do NOT simplify or "clean up" patterns that look unconventional —
  they are likely deliberate (e.g., `Exception.if`, `#_ = {}`,
  anonymous class singletons, `...args` parsing)
- Do NOT modify files outside the scope of what was asked for
- Do NOT touch `_` prefixed parcels — they are inactive placeholders
- Do NOT modify or delete `history/` folders
- Do NOT change the `rollo` parcel's zero-dependency rule

### Style
- Do NOT add TypeScript
- Do NOT add JSDoc
- Do NOT use `let` where `const` with an IIFE would work
- Do NOT use camelCase or PascalCase for file names
- Do NOT introduce plain objects where a class would be more consistent
- Do NOT use `//` comments for documentation that should survive
  minification — use `/* */`

### Tooling
- Do NOT suggest replacing Bootstrap — it's a deliberate choice
- Do NOT suggest replacing the `use` engine with standard imports
- Do NOT suggest established frameworks (React, Vue, etc.) as
  replacements for Rollo's custom systems
- Do NOT try to "fix" the Plotly loading without discussing first
- Do NOT suggest centralizing/DRYing the per-parcel test harnesses

### Workflow
- Do NOT commit on `main` — work in the session worktree
- Do NOT push to any remote without explicit permission
- Do NOT create README or documentation files unless asked
- Do NOT make changes outside the session worktree directory
- Do NOT promote test code to `src/` without approval — tests are
  the staging ground, promotion is a deliberate step

### Dependencies
- Do NOT add npm dependencies to the `rollo` parcel
- Do NOT add dependencies without discussing first — Rollo is
  intentionally lean
- Do NOT import from `node_modules` in the `rollo` parcel source

### Bundle safety
- Do NOT let test files or test-only code leak into production bundles
- Do NOT create imports from `test/` in `src/` files

## 10. Working agreement

### How we collaborate

1. I work in the session worktree (`.claude/worktrees/<session-name>/`)
2. For new features: I write code in test files first (`.test.js` in
   the relevant parcel's `test/tests/` directory)
3. You run the dev server (`npm run dev`), open the browser, and
   visually verify with Shift+U
4. You tell me what to adjust — we iterate
5. When you're happy, we promote code from test to `src/`
6. I commit on the worktree branch as we go (save points)
7. You manually copy approved files to your main checkout
8. You commit on `main` yourself via VS Code's Source Control panel

### For new parcels

I scaffold the full parcel structure following current conventions
(use `form`, `modal`, `router` as reference — never `_` prefixed
parcels). This includes: `index.html`, `index.js`, `package.json`,
`vite.config.js`, `use.js`, `src/`, and `test/` with the new-style
`run()` harness.

### Communication style

- Explain what you want in plain language
- Point me to specific parcels or files when you can
- Tell me whether to investigate or make changes
- Flag when something is experimental vs production-ready
- I'll ask before making architectural decisions
- I'll flag open questions rather than guessing

### The companion app

I can read the Anvil companion app at `E:/rollo/server` whenever
a parcel's server-side contract matters. You don't need to paste
code into the chat — just point me there.

### Companion app collaboration

For work that touches the companion app, I write directly in
`E:/rollo/server/test_code/` — a completely safe staging area where
code never enters the actual app.

**client_code work:**
1. I write test files in `E:/rollo/client/test/client_code/tests/`
   (JS and/or Python)
2. You run `test/client_code/test.py` and visit
   `rollohdev.anvil.app/test`
3. You verify with Shift+U and tell me what to adjust
4. Once solid, you promote code to the companion app's `client_code`

**server_code work (endpoints):**
1. I write endpoint scripts in `E:/rollo/server/test_code/servers/`
   (following the pattern in `echo.py`)
2. I write matching client tests in `E:/rollo/server/test_code/clients/`
   (Python for RPC testing, HTML for HTTP testing)
3. You run the server script, then test via the client
4. Once solid, you promote the endpoint to
   `E:/rollo/server/server_code/srv/`

In both cases, you handle promotion to production manually.
