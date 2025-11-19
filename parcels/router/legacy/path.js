//const { app } = await use("@/app/");
const { Exception } = await use("@/tools/exception.js");
const { type } = await use("@/tools/type.js");

const instance = new (class Path {
  #_ = {
    registry: new Map(),
  };

  constructor() {
    this.#_.effects = new (class Effect {
      #_ = {};

      constructor(registry) {
        this.#_.registry = registry;
      }

      get tags() {
        return Array.from(this.#_.registry.keys());
      }

      add(tag, effect, ...args) {
        const condition = args.find((a) => typeof a === "function");
        const data = { ...(args.find((a) => type(a) === "Object") || {}) };

        const registry = (() => {
          if (this.#_.registry.has(tag)) return this.#_.registry.get(tag);
          const registry = new Map();
          this.#_.registry.set(tag, registry);
          return registry;
        })();

        const detail = { data };
        if (condition) {
          detail.condition = condition;
        }

        registry.set(effect, Object.freeze(detail));

        return effect;
      }

      size(tag) {
        return this.#_.registry.has(tag)
          ? this.#_.registry.get(tag).size
          : null;
      }
    })(this.#_.registry);
  }

  get effects() {
    return this.#_.effects;
  }

  set(current) {
    if (current === location.pathname) {
      return this;
    }

    const previous = location.pathname.split("/").filter((p, i) => i);
    history.pushState({}, "", current);
    current = current.split("/").filter((p, i) => i);

    /* Get index at change */
    const index = current.findIndex((p, i) => p !== previous.at(i));
    /* Create unchanged fragment */
    const unchanged = index ? `/${current.slice(0, index).join("/")}` : "";
    /* Create head: Leading fragment terminated at and including changed part */
    const head = index
      ? `/${current.slice(0, index + 1).join("/")}`
      : `/${current.at(0)}`;
    /* Create tail: Trailing fragment starting after changed part */
    const tail = index
      ? `/${current.slice(index + 1).join("/")}`
      : `/${current.slice(1).join("/")}`;

    

    app.$({ path: location.pathname });
    //app.$.path = location.pathname

    if (this.#_.registry.has(head)) {
      const registry = this.#_.registry.get(head);
      if (registry.size) {
        for (const [effect, detail] of registry.entries()) {
          const { condition } = detail;
          if (
            !condition ||
            condition({ head, index, tail, unchanged }, detail)
          ) {
            effect({ head, index, tail, unchanged }, detail);
          }
        }
      }
    }

    return this;
  }
})();

export const path = new Proxy(() => {}, {
  get(target, key) {
    Exception.if(!(key in instance), `Invalid key: ${key}`);
    const value = instance[key];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
  set(target, key, value) {
    Exception.if(!(key in instance), `Invalid key: ${key}`);
    instance[key] = value;
    return true;
  },
  apply(target, thisArg, args) {
    return instance.set(...args);
  },
});


/* Usage
const { component } = await use("@/component.js");
const { layout } = await use("@/layout/");

export default async ({ path }) => {
  layout.clear(":not([slot])");

  path.effects.add('/bar', ({ head, index, tail, unchanged }) => {
    //console.log(`unchanged:`, unchanged); ////
    console.log(`head:`, head); ////
    //console.log(`tail:`, tail); ////
  })

  const container = component.main("container", { parent: layout });

  const previous = "/foo/bar/ding";
  history.pushState({}, "", previous);
  component.h1("d-flex.justify-content-end.w-100", {
    parent: container,
    text: previous,
  });

  const currentDisplay = component.h1("d-flex.justify-content-end.w-100", {
    parent: container,
  });

  const button = component.button("btn.btn-primary", {
    parent: container,
    text: "Set path",
  });
  
  button.on.click = (event) => {
    const current = "/bar/stuff/things";
    currentDisplay.text = current;
    path(current);
  };
};

*/