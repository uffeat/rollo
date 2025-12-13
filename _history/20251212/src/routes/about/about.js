import { component } from "component";
import { layout } from "@/layout/layout";

export default new (class {
  #_ = {};

 

  get page() {
    if (!this.#_.page) {
      this.#_.page = component.main(
        "container pt-3",
        component.h1({ text: "About" })
      );
    }
    return this.#_.page;
  }

  enter(meta, url, ...paths) {
    layout.clear(":not([slot])");
    layout.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();
