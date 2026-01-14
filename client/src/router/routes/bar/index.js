import "@/use";
import { Spinner } from "@/tools";

const { Bar } = await use("@/plotly/");
const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Bar chart" })
      );
    }
    return this.#_.page;
  }

  async enter() {
    frame.clear(":not([slot])");
    frame.append(this.page);

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

  async exit() {
    this.page.remove();
  }
})();
