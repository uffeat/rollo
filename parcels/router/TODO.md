# This TODO also covers the `routes` parcel
1. Refactor so that routes can be created and consumed as parcels taking advantage of the dynamic import feature that `use` offers.
2. Consider:
   - Should `router` be refactored away from a singleton and towards a series of nested `router` instances that also constitute routes? The idea would be that each router/route is associated with a single "path part", "level", a "parent" (unless top-level) and one or more "children" (unless leaf). This concept would lend itself well to  specifying routes via HTML trees.