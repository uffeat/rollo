export const UK = new (class UK {
  #_ = {};

  get UIkit() {
    return this.#_.UIkit
  }

  get using() {
    return this.#_.using
  }

  modal() {

  }

  async use() {
    if (this.using) {
      return
    }
    await use("/assets/uk/uk.js", { as: "function" });
    await use("/assets/uk/uk-icons.js", { as: "function" });
    await use("/assets/uk/uk.css", { as: "link" });

    this.#_.modalSheet = await use("/assets/uk/modal.css");

    this.#_.UIkit = globalThis.UIkit;

    this.#_.using = true



    //console.log(this.#_.UIkit)////
    //console.dir(this.#_.UIkit)////
    //delete globalThis.UIkit;
  }
})();
