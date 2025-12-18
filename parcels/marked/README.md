# About

For runtime MD -> HTML transpilation, typically for `.md` files in `/public`. Intended for light ad-hoc direct use of MD. For heavier stuff, rely instead on build tools. 

Directly exposes `marked` and `Marked` and a few plugins, sets up baseURL and adds a few helpers. In the typical use case, `marked` is used directly, but customization can be done with  `new Marked()` etc.

# Role in import engine

`marked` does not diretly support Frontmatter. However (by using `marked` and `YAML`), the import engine (`use`) implements an `md` type handler that transpiles

- Pure MD -> HTML.
- Frontmatter-style MD -> an object with the shape `{ html, meta }`.

# Caution

Buildtime (build tools) and runtime (thie parcel + `use`) MD transpilation are similar, but /**NOT**/ identical. Differences include:

- Rebasing of images and links: Takes place in this parcel, but not in runtime version (which is typically used with runtime post-processing).
- Runtime version supports emoji, footnote and table pluging; this parcel does not.
- This parcel uses (by default) `gfm`, whereas build tools uses `commonmark`.
- ... and more...

These differences do not constitute an issue per se. But need to take them into account if some content handling graduates from runtime to buildtime.

# Deps

npm install marked
npm i marked-base-url
npm i marked-directive
