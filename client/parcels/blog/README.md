# About

# Notes

## Multi-object exports

Parcels that export multiple objects are problem-free with respect to production. However, issues can occur for in-parcel testing... The reasons for this are not entirely clear to me, but it has something to do with collisions between the import engine used by use-imported assets and the local import engine spun up for testing. Specifically, certain globals (e.g., customRegistry) somehow get served redundantly... Here's the fix:

- Only `index.js` initializes the import engine (with `import "./use.js";`).
- Modules in `/src` that need to use `use` expose a factory functions, which is then called in `index.js` with the global `use` passed in - essentially DI.

It would be more elegant, if the import engine could guard aginst such issues, but the current workaround is robust and clean - only slightly more verbose.

