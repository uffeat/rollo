# Features

- `mixins/name.js`:
  - Ensure that all components have a name prop with attr reflection. Not sure, if they have?
  - For form controls, mirror name onto id with a prefix that makes it unique.

- `mixins/value.js`:
  - Overload, so that value can be a non-string
  - Interpretation of numbers, Booleans and null
  - Be careful with form controls; perhaps skips these.

# Refinements

- `mixins/classes.js`: 
   - Add `class` prop: Proxy that sets a single class Perhaps func target for setting multiple.

