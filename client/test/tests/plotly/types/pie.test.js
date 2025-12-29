/* 
/plotly/types/pie.test.js
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
    function() {
      Pie({ Good: 19, Bad: 26, Ugly: 55 }).then((plot) => this.append(plot))


    },
   
    /* Could also do:
    await Pie({ Good: 19, Bad: 26, Ugly: 55 })
    or
    await Pie({ Good: 19 }, { Bad: 26 }, { Ugly: 55 });
    */
  );
};
