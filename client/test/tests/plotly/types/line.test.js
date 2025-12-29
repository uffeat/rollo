/* 
/plotly/types/line.test.js
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
    await Line(
      {
        xaxis: "Quantity",
        yaxis: "Price",
        smooth: true,
        markers: false,
      },
      {
        Supply: [
          [0, 0],
          [20, 20],
          [30, 30],
          [40, 40],
        ],
      },
      {
        Demand: [
          [0, 40],
          [20, 30],
          [30, 20],
          [40, 0],
        ],
      }
    )
    
  );
};
