let key;

if (import.meta.env.DEV) {
  key = (await import("../../../../secrets.json")).default.development.server;
}

export { key as default };
