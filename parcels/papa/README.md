# About

Directly exposes `Papaparse` for CSV parsing.

# Note

`Papaparse` is not provided as ESM, but a small change to the original `papaparse.js` makes it possible to import the package as ESM:
Replaced `this` argument in top-level function with `globalThis`.

This enables use as a parcel. The alternative would have been to load as classic script at runtime, which would break parcel encapsulation by and probably be less performant.

Make sure that 