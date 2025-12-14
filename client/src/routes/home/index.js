import "@/use";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

export default new (class {
  #_ = {};

  constructor() {
    this.#_.page = component.main(
      "container pt-3",
      component.h1({ text: "Home" })
    );
  }

  get page() {
    return this.#_.page;
  }

  enter(meta, url, ...paths) {
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();
