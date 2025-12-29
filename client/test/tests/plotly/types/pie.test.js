/* 
/plotly/types/pie.test.js
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
    Pie({ Good: 19, Bad: 26, Ugly: 55 })
    /* Could also do:
    Pie({ Good: 19 }, { Bad: 26 }, { Ugly: 55 });
    */
  );
};
