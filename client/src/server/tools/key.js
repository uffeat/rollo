export default import.meta.env.DEV
  ? (await import("../../../../secrets.json")).default.development.server
  : null;
