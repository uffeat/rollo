import "@/use";
import { Line } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Line chart" })
      );
    }
    return this.#_.page;
  }

  setup() {
    const plot = Line(
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
