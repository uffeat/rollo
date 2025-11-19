const { Exception } = await use("@/tools/exception.js");
const { type } = await use("@/tools/type.js");
const { Reactive, Ref, ref, reactive } = await use("@/state.js");
//const { app } = await use("@/app/");

const instance = new (class Router {
  #_ = {};

  constructor() {
    this.#_.state = Reactive.create({}, {owner: this, name: 'router'});
  }

  get effects() {
    return  this.#_.state.effects
  }

  /* */
  async push(path) {}

  /* */
  async replace(path) {}

  /* */
  async import(path) {}




  /* */
  async set(path, silent = false) {
    console.log("set got path:", path); ////

    if (path === "/" && this.#_.home) {
      path = this.#_.home;
    }

    this.#_.state.update({ path });

    console.log("previous:", this.#_.previous); ////

    const current = `/${path.split("/").at(1)}`;
    this.#_.state.update({ page: current });
    console.log("current:", current); ////

    const residual = path.split("/").slice(2).join("/");
    this.#_.state.update({ residual });
    console.log("residual:", residual); ////

    if (this.#_.previous === current) {
      return this;
    }
    this.#_.previous = current;

    if (silent === false) {
      history.pushState({}, "", current);
    }

    app.$({ path: current });

    const mod = await use(`@${current}.js`);
    await mod.default({ current, residual, router: this });

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
  await instance.set(location.pathname, true);
});

/* Expose proxy version for a leaner syntax */
export const router = new Proxy(() => {}, {
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
