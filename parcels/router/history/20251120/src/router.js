const { Exception } = await use("@/tools/exception.js");
const { is } = await use("@/tools/is.js");
const { type } = await use("@/tools/type.js");
const { Reactive, Ref, ref, reactive } = await use("@/state.js");
//const { app } = await use("@/app/");

const instance = new (class Router {
  #_ = {
    added: new Map(),
  };

  constructor() {
    this.#_.state = Ref.create({ owner: this, name: "router" });
  }

  get effects() {
    return this.#_.state.effects;
  }

  add(path, route) {
    this.#_.added.set(path, route);
  }

  /* */
  async set(path, silent = false) {
    if (path === "/" && this.#_.home) {
      path = this.#_.home;
    }
    const current = `/${path.split("/").at(1)}`;
    this.#_.state.update(current);
    const residual = path.split("/").slice(2).join("/");
    if (this.#_.previous === current) {
      return this;
    }
    this.#_.previous = current;
    if (silent === false) {
      history.pushState({}, "", current);
    }
    app.$({ path: current });
    if (this.#_.added.has(current)) {
      const route = this.#_.added.get(current);
      await route({ current, residual, router: this });
    } else {
      const mod = await use(`@${current}.js`);
      await mod.default({ current, residual, router: this });
    }

    return this;
  }

  /* */
  async setup(home) {
    this.#_.home = home;
    this.set(location.pathname, true);
    return this;
  }
})();

/* */
window.addEventListener("popstate", async (event) => {
  const result = await instance.set(location.pathname, true);
});

/* Expose proxy version for a leaner syntax */
export const router = new Proxy(async () => {}, {
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

