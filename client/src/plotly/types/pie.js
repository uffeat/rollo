import { Plot } from "../plot";
import { Layout } from "../tools/layout";

export const Pie = (...traces) => {
  const labels = [];
  const values = [];

  for (const trace of traces) {
    for (const [label, value] of Object.entries(trace)) {
      labels.push(label);
      values.push(value);
    }
  }

  return Plot({
    data: [
      {
        values,
        labels,
        type: "pie",
        textinfo: "label+percent",
      },
    ],
    layout: {
      showlegend: false,
      ...Layout(),
    },
  });
};
