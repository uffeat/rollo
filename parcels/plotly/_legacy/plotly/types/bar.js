import { Plot } from "../plot";
import { Axis, Layout } from "../tools/layout";

export const Bar = async ({ xaxis, yaxis, x, ...updates }, ...traces) => {
  const data = [];
  for (const trace of traces) {
    for (const [name, y] of Object.entries(trace)) {
      data.push({ x, y, type: "bar", name });
    }
  }

  const plot = await Plot({
    data,
    layout: {
      xaxis: Axis(xaxis),
      yaxis: Axis(yaxis),
      ...Layout(),
    },
    ...updates,
  });
  

  return plot;
};
