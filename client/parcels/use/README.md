# About

# Notes
- Source, types and processors handlers are invoked with 'call'; not really to bind, but to enable registration of non-function objects with a 'call' method.
- Consuming code does not have direct access to 'path'. Handler (e.g., source handlers) can therefore safely use the mutable path.detail to provide instructions re the subsequent flow (e.g., processing). Only (moderate) risk is that other handlers change path.detail with unintended consequences.
