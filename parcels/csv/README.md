# About

Exposes CSV parser based on Papa Parse v5.5.3 (https://github.com/mholt/PapaParse).

The exposed CSV parser is a class-based singleton. It provides access to the
original Papa, but also implements its own leaner 'parse' method intended for simple cases.
  
To extend the CSV parser use 'CSV.constructor'.

# Implementation

Papa Parse is not available as an ES module or an npm package - only as iife download.
To get around this:

- A tiny modification is made to to the original iife to make it in-module runable.
- The iife is minified (with a VS Code extension).
- The iife is run, Papa is harvested, removed from global and then exported.

## Alternatives 
The current implementation approach hinges on making the iife in-module runable. It seems to work, but if it
proves not to be robust, change the implementation to:

- Raw-import the original 'papa.js' (perhaps minified).
- Create and run a function from the raw text.
- Harvest Papa, removed from global and export.

The code to do this has been prepared in 'legacy\csv.js'.

Alternatively, the original 'papa.js' could be placed in 'src/libs' and then:

```
await use("/libs/papa.js", { iife: true });
const csv = globalThis.Papa;
delete globalThis.Papa;
export { csv };

```
... essentially the same thing, but breaking parcel encapsulation.