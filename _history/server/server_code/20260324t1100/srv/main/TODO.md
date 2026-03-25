# General

- Perhaps merge Rpc and Api into a single class with automatic delegation based on `_type`.
- Perhaps let targets live inside `main`. Could perhaps provide benefits similar to the way packages are managed in client_code?

# State

- Decide on a way to "sync" state: client <-> iworker <-> server. Ideas:
  - Source of truth in iworker - as a reactive object
    - with a dto for sending to server coms
    - with effect that sends to client
    - perhaps with an option to save to sessionStorage?
- Experiment with shared client-server state; if not possible by mutation, then perhaps a client writable view. Fallback: Include in every request/response.

# Rpc

- Automatic (or hint-based) inferral of return type instead of 'returns' in options.
- Perhaps incoming `data` as blob - or option with automatic inferral
