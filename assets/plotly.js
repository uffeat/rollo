await use("/assets/plotly.js", { as: "script" });
const l = globalThis.Plotly;
delete globalThis.Plotly;
export {
  l as Plotly
};
