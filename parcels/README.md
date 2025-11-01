# About

`parcels` contains child dirs ("parcels") that each contain the source code for a Vite-powered lib. Parcels are consumed by the client app via its import engine.

## Why?

- Parcels do not affect the client app's (JS) bundle size and can therefore contain even very large packages without affect initial load.
- Parcels can be tested by running in-pacel dev servers - isolated from, but with access to external JS modules and other built parcels.

## How it works

- Each parcel should build to `assets` - either directly or if the parcel also builds a sheet to a same-name dir.
- The build tool `build/assets.py` packages the content of `assets`, so that it can be consumed by the client app. It does so by:
  - Transpiling the built parcel JS into an asset-carrier sheet.
  - Aggregating built parcel CSS into a single main sheet. For this, the build tool reads `build/build.config.json`, in which a priority can be assigned to the the built sheet (higher number pushes the CSS up in the main sheet and as such means "lower priority").
- If the parcel contains a `test` child dir, the build tool places copies of the main sheet and the asset-carrier sheet inside that test dir. In that way, parcel tests can access other (built, but uncommitted) parcels.

# Testing

For an example of local parcel testing see `parcels/sheet/index.html` together with `parcels\sheet\index.html`. Local parcel testing offers a clean and focused approach, but testing can also be done at the client app level (for examples see `client/test/test.js` along with `client/test/test.html`). Client app-level testing provides greater flexibility with respect to code that tests have access to.

# Caveats and limitations

- Parcels should not be used for stuff that require "build-time awareness", such as React and Tailwind (could be done, but cleaner to place such code in the client app).
- Parcels can (and should when needed) consume npm packages. However, parcels should be carefully structured to avoid redundant inclusion of such packages in the asset-carrier sheet. It's good practice to create dedicated parcels for specific npm packages. This not only ports the npm package to the carrier sheet, but also mitigates the said redundancy.
