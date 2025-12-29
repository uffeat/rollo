/* 
/plotly/types/bar.test.js
*/
import { Bar, Bubble, Line, Pie, Stacked } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear();

  component.main(
    "container pt-3",
    { parent: frame },
    component.h1({ text: "Quick plot" }),
    await Bar(
      {
        xaxis: "Animal",
        yaxis: "Population",
        x: ["Zebras", "Lions", "Pelicans"],
      },
      /* Could also do:
          { "New York": [90, 40, 60] },
          { "San Francisco": [10, 80, 45] }
          */
      { "New York": [90, 40, 60], "San Francisco": [10, 80, 45] }
    )
  );
};
