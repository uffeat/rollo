/* 
/plotly/types/stacked.test.js
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
    await Stacked(
      {
        xaxis: "Month",
        yaxis: "Revenue",
        smooth: true,
        markers: false,
      },
      /* Could also do:
      {
        Basic: [
          [1, 10],
          [2, 15],
          [3, 20],
          [4, 20],
        ],
      },
      {
        Premium: [
          [1, 5],
          [2, 10],
          [3, 20],
          [4, 40],
        ],
      }
      */
      {
        Basic: [
          [1, 10],
          [2, 15],
          [3, 20],
          [4, 20],
        ],
        Premium: [
          [1, 5],
          [2, 10],
          [3, 20],
          [4, 40],
        ],
      }
    )
    
  );
};
