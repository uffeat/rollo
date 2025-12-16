const key = import.meta.env.DEV ? (await import("../../../../secrets.json")).default.development.server : null



export { key as default };
