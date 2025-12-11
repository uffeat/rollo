import "@/use";


let result;

export async function Plotly() {
  if (result) {
    return result;
  }

  //await use("/assets//plotly.css");
  await use("/assets/plotly/", { as: "script" });
  result = globalThis.Plotly;
  delete globalThis.Plotly;
  return result
 
}
