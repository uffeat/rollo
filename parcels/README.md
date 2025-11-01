# About

`parcels` contains child dirs ("parcels") that each contain thesource code for a Vite-powered lib. Parcels are consumed by the client app via its import engine.

## Why?

- Parcels do not affect the client app's (JS) bundle size and can therefore contain even very large packages without affect initial load.
- Parcels can be tested by running in-pacel dev servers - isolated from, but with access to external JS modules and other built parcels.

## How it works

- Each parcel should build to `assets` - either directly or if the parcel also builds a sheet to a same-name dir.
- The build tool `build/assets.py` packages the content of `assets`, so that it can be consumed by the client app. It does so by:
  - Transpiling the built parcel JS into an asset-carrier sheet.
  - Aggregating built parcel CSS into a single main sheet. For this, the build tool reads `build/build.config.json`, in which a priority can be assigned to the the built sheet (higher number pushes the CSS up in the main sheet and as such means "lower priority").

# Testing
