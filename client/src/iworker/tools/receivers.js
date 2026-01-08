const { Exception, TaggedSets, match, merge, freeze, is } = await use(
  "@/rollo/"
);

/* Somewhat similar to 'receiver', but 
- stateless (except for queue)
- not limited to flat objects
- effects orgnaised across any number of 'tags' (i.e., "channels"/"domains")
- no change-detection
- no conditional effects.
NOTE 
Flow: iframe -> parent.
Consuming code can implement change-detection, conditional effects etc.
*/
export const receivers = new (class {
  #_ = {
    registry: new TaggedSets(),
    queue: new Map(),
  };
  constructor() {
    const owner = this;
    this.#_.onmessage = (event) => {
      if (
        event.origin !== use.meta.companion.origin ||
        !is.object(event.data) ||
        event.data.type !== "receivers"
      ) {
        return;
      }
      const { data, target } = event.data;
      Exception.if(
        !is.object(event.data) && !is.array(event.data),
        `Invalid 'event.data' type.`,
        () => console.error("event.data:", event.data)
      );

      const effects = this.#_.registry.values(target);
      if (effects) {
        if (this.#_.queue.has(target)) {
          merge(data, this.#_.queue.get(target));
          this.#_.queue.delete(target);
        }
        freeze(data);
        for (const effect of effects) {
          effect(data, { effect, name: target });
        }
      } else {
        if (this.#_.queue.has(target)) {
          merge(data, this.#_.queue.get(target));
        } else {
          this.#_.queue.set(target, data);
        }
      }
    };

    this.#_.effects = new (class {
      add(name, effect) {
        owner.#_.registry.add(name, effect);
      }

      clear(name) {
        owner.#_.registry.clear(name);
      }

      remove(name, effect) {
        owner.#_.registry.remove(name, effect);
      }
    })();

    this.start();
  }

  get active() {
    return this.#_.active;
  }

  get effects() {
    return this.#_.effects;
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