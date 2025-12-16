await use("/assets/papa.js", { as: "script" });
const a = globalThis.Papa;
delete globalThis.Papa;
export {
  a as Papa
};
