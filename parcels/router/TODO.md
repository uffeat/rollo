# 1st priority

- Preserve hash and query on pushState and replaceState.
- Capture query and weave into a Reactive state embedded in the router; probably means that the 'effects' member should be refactored to accept a 'path'/'query' flag.

# Lower priority

- Support fully nested rounds. Likely, requires major conceptual remake.
