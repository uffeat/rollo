# Features

- component `difference`, `merge`, `subtract` methods - and similar that allows use of html as data stores

- Web componentfor wrapping non-autonomous

- `mixins/name.js`:
  - Ensure that all components have a name prop with attr reflection. Not sure, if they have?
  - For form controls, mirror name onto id with a prefix that makes it unique.

- `mixins/value.js`:
  - Overload, so that value can be a non-string
  - Interpretation of numbers, Booleans and null
  - Be careful with form controls; perhaps skips these.

- Refactor `Mixins` to allow injection (e.g., stateMixin)

# Refinements

factory: Hadnle arry arg -> append

- `mixins/classes.js`: 
   - Add `class` prop: Proxy that sets a single class Perhaps func target for setting multiple.
