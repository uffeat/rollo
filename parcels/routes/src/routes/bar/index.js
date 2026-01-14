import "../../../use";
import { Route } from "../../tools/route";

const { Bar } = await use("@/plotly/");
const { component } = await use("@/rollo/");
const { Spinner } = await use("/tools/spinner");

export default new (class extends Route {
  #_ = {};

  constructor() {
    super({
      page: component.main(
        "container pt-3",
        component.h1({ text: "Bar chart" })
      ),
    });
  }

  async enter() {
    await super.enter();

    if (!this.#_.plot) {
      const spinner = Spinner({
        parent: this.page,
        size: "8rem",
        marginTop: "3rem",
      });

      this.#_.plot = await Bar(
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
      );
      spinner.remove();

      this.page.append(this.#_.plot);
    }
  }
})();
