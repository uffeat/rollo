"""Package that contains scripts for spinning up local servers that can serve
- endpoints as-is, regardless of commit status (without changing the actual endpoint). 
  This is useful for debugging exiting endpoints.
- endpoints not in server_code. Same-name endpoints are overloaded. This is useful 
  as a precursor to refactoring endpoints and to create new endpoints (and does not require commits).
"""