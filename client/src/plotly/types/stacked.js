import { Plot } from "../plot";
import { Axis, Layout } from "../tools/layout";

export const Stacked = (
  { lines = true, markers = true, smooth = false, xaxis, yaxis, ...updates },
  ...traces
) => {
  const mode = (() => {
    if (lines && markers) {
      return "lines+markers";
    }
    if (lines && !markers) {
      return "lines";
    }
    if (!lines && markers) {
      return "markers";
    }
  })();

  const line = { shape: smooth ? "spline" : "linear" };

  const data = [];
  for (const trace of traces) {
    for (const [name, series] of Object.entries(trace)) {
      const x = [];
      const y = [];
      for (const [_x, _y] of series) {
        x.push(_x);
        y.push(_y);
      }
      data.push({
        type: "scatter",
        stackgroup: "one",
        mode,
        line,
        name,
        x,
        y,
      });
    }
  }

  const plot = Plot({
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
