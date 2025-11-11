await use("/assets/papa.js", { as: "script" });

const Papa = globalThis.Papa;

delete globalThis.Papa;

export { Papa };
