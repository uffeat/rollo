import "@/use";
import { Pie } from "@/plotly";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "Pie chart" })
      );
    }
    return this.#_.page;
  }

  setup(base) {
    const plot = Pie({ Good: 19, Bad: 26, Ugly: 55 });
    /* Could also do:
    const plot = Pie({ Good: 19 }, { Bad: 26 }, { Ugly: 55 });
    */
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
