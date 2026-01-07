const { Exception, Reactive, is } = await use("@/rollo/");

/* Wrapped version of 'Reactive' updated by iworker. 
NOTE Flow: iframe -> parent. */
export const receiver = new (class {
  #_ = {
    state: new Reactive(),
  };
  constructor() {
    this.#_.onmessage = (event) => {
      if (
        event.origin !== use.meta.anvil.origin ||
        !is.object(event.data) ||
        event.data.type !== "receiver"
      ) {
        return;
      }
      const { data } = event.data;
      Exception.if(!is.object(event.data), `Invalid 'event.data' type.`, () =>
        console.error("event.data:", event.data)
      );
      this.#_.state.update(data);
    };

    this.start();
  }

  get active() {
    return this.#_.active;
  }

  get computed() {
    return this.#_.state.computed;
  }

  get change() {
    return this.#_.state.change;
  }

  get current() {
    return this.#_.state.current;
  }

  get effects() {
    return this.#_.state.effects;
  }

  get previous() {
    return this.#_.state.previous;
  }

  get size() {
    return this.#_.state.size;
  }

  get session() {
    return this.#_.state.session;
  }

  start() {
    window.addEventListener("message", this.#_.onmessage);
    this.#_.active = true;
  }

  stop() {
    window.removeEventListener("message", this.#_.onmessage);
    this.#_.active = false;
  }
})();
