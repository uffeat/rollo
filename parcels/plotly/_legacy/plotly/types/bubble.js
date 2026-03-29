import { Plot } from "../plot";
import { Axis, Layout } from "../tools/layout";

export const Bubble = async ({ xaxis, yaxis, ...updates }, ...traces) => {
  const data = [];
  for (const trace of traces) {
    for (const [name, series] of Object.entries(trace)) {
      const x = [];
      const y = [];
      const size = [];
      for (const [_x, _y, _size] of series) {
        x.push(_x);
        y.push(_y);
        size.push(_size);
      }
      data.push({
        type: "scatter",
        mode: "markers",
        name,
        marker: {
          size,
        },
        x,
        y,
      });
    }
  }

  const plot = await Plot({
    data,
    layout: {
      xaxis: Axis(xaxis),
      yaxis: Axis(yaxis),
      //showlegend: false,
      ...Layout(),
    },
    ...updates,
  });

  return plot;
};
