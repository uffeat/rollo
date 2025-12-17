/* Returns server access key.
NOTE Using hard `import.meta.env.DEV` guard (rather than `use.meta.DEV`), since 
production code breaks on attempt to import beyond `client` scope. Besides,
in production server access is granted based on origin, not key. */
export default import.meta.env.DEV
  ? (await import("../../../../secrets.json")).default.development.server
  : null;
