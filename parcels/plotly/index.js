await use("/assets/plotly.js", { as: "script" });

const Plotly = globalThis.Plotly;

delete globalThis.Plotly;

export {Plotly}
