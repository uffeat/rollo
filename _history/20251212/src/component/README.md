# About

Web component toolbox, incl.:

- Pre-made non-autonomous web components on-demand.
- Factory for creation of inline component trees.
- Tools for authoring mixin-based non-autonomous and autonomous web components.
- Technical notes
  Tailwind is installed for the test suite, but is not part of the parcel.

# Mixins

## mixins/on.js

Includes a feature for additional handler "tracking". This feature enables:

- Clearing of all handler of a given type.
- Teting if a given handler has been registered.
- Inspection of the number of handlers registered for a given type.

Requires handlers to be registered/deregistered with the {track: true} option... Not an ideal DX and I did consider making tracking the default. However, while nice, it's likely only relevant in special cases. Moreover, similar tracking can be achieved with reactive syntax, e.g., button.$({ "on.click": (event) => console.log("Clicked") }); in combination with effects.
