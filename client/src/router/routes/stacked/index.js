import "@/use";
import { Stacked } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Stacked area chart" })
      );
    }
    return this.#_.page;
  }

  setup(base) {
    const plot = Stacked(
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
    );
    this.page.append(plot);
  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();
