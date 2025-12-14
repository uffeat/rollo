import "@/use";

const { component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

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
    frame.clear(":not([slot])");
    frame.append(this.page);
  }

  exit(meta) {
    this.page.remove();
  }
})();
