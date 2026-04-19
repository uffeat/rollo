const { Mixins, component, mix, registry, stateMixin } = await use("@/rollo/");

registry.add(
  class extends mix(HTMLElement, {}, ...Mixins(stateMixin)) {
    #_ = {};

    constructor() {
      super();
      this.#_.slot = component.slot();
      this.#_.shadow = component.div({ id: "root" }, this.#_.slot);
      
      this.attachShadow({ mode: "open" }).append(this.#_.shadow);
      this.#_.slot.on.slotchange((event) => {
        this.send("change", { detail: Array.from(this.children).at(0) });
      });
    }



    get shadow() {
      return this.#_.shadow
    }
  },
  "anvil-slot",
);
