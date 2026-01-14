/* 
/types/bubble.test.js
*/

const { Bar, Bubble, Line, Pie, Stacked } = await use("@/plotly/");
const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear();

  component.main(
    "container pt-3",
    { parent: frame },
    component.h1({ text: "Quick plot" }),
    await Bubble(
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
