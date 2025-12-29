/* 
/plotly/traces.test.js
*/
import { Axis, Plot, Layout } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default async () => {
  frame.clear();

  const x = ["Zebras", "Lions", "Pelicans"];
  const type = "bar";
  const Trace = (name, y) => ({ x, y, type, name });

  const buttonStyle = "btn.btn-primary";

  const plot = await Plot({
    data: [
      Trace("New York", [90, 40, 60]),
      Trace("San Francisco", [10, 80, 45]),
    ],
    layout: {
      xaxis: Axis("Animal"),
      yaxis: Axis("Population"),
      ...Layout(),
    },
  });

  /* Here's an example of 'non-partially' updating layout. It would be more 
    efficient to use `plot.relayout`, but this is just to demo the use of 'update'. */
  plot.update({
    layout: {
      xaxis: Axis("Name of animal"),
      yaxis: Axis("How many we have"),
      ...Layout(),
    },
    /* If we want to signal that config and data should not be touched, we could (redundantly) do: */
    data: null,
    config: null,
  });

  /* Here's an example of 'non-partially' updating data. It would be more 
    efficient to use `plot.taces`, but this is just to demo the use of 'update'. */
  plot.update({
    data: [
      Trace("New York", [10, 40, 90]),
      Trace("San Francisco", [90, 40, 10]),
    ],
  });

  const page = component.main(
    "container pt-3",
    { parent: frame },
    component.h1({ text: "Bar plot" }),
    component.menu(
      "flex justify-end flex-wrap gap-3 me-3",
      component.button(
        buttonStyle,
        {
          "on.click": (event) => {
            plot.relayout({ yaxis: Axis("Number") });
            //console.log("layout:", plot.layout); ////
          },
        },
        "Change layout"
      ),
      component.button(
        buttonStyle,
        {
          "on.click": (event) => {
            //plot.traces._add(Trace("Copenhagen", [10, 20, 40]));
            plot.traces.insert(Trace("Copenhagen", [10, 20, 40]));
          },
        },
        "Append Copenhagen"
      ),

      component.button(
        buttonStyle,
        {
          "on.click": (event) => {
            //plot.traces._delete("San Francisco");
            plot.traces.update("San Francisco", null);
          },
        },
        "Remove San Francisco"
      ),
      component.button(
        buttonStyle,
        {
          "on.click": (event) => {
            //plot.traces._update("New York", { y: [40, 40, 40] });
            plot.traces.update("New York", { y: [40, 40, 40] });
            console.log("plot.data:", plot.data);
          },
        },
        "Change New York"
      )
    ),
    plot
  );
};
