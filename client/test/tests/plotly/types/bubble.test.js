/* 
/plotly/types/bubble.test.js
*/
import { Bar, Bubble, Line, Pie, Stacked } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default () => {
  frame.clear();

  component.main(
    "container pt-3",
    { parent: frame },
    component.h1({ text: "Quick plot" }),
    Bubble(
      {
        xaxis: "Business strength",
        yaxis: "Market attractiveness",
      },
      /* Could also do:
        { "Awesome": [[10, 10, 20], [20, 20, 30], [30, 30, 40], [40, 40, 50],] },
        { "Gnarly": [[10, 40, 10], [20, 30, 20], [30, 20, 30], [40, 10, 20],] }
        */
      {
        Awesome: [
          [10, 10, 20],
          [20, 20, 30],
          [30, 30, 40],
          [40, 40, 50],
        ],
        Gnarly: [
          [10, 40, 10],
          [20, 30, 20],
          [30, 20, 30],
          [40, 10, 20],
        ],
      }
    )
  );
};
