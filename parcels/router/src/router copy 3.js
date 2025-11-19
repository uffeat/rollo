const { Exception } = await use("@/tools/exception.js");
const { type } = await use("@/tools/type.js");
const { Reactive, Ref, ref, reactive } = await use("@/state.js");
//const { app } = await use("@/app/");

const instance = new (class Router {
  #_ = {};

  constructor() {
    this.#_.XXXstate = Reactive.create();
    /* state -> url */
    this.#_.XXXstate.effects.add(
      ({ path }, message) => {
        console.log("path:", path);
        const pathname = path.slice(1, -3);
        history.pushState({}, "", pathname);
      },
      ["path"]
    );
  }

  /* */
  async set(path) {
    if (!path) {
      return this;
    }

    const currentPage = path.slice(1, -3).split("/").at(1);
    //console.log("currentPage:", currentPage); ////

    const pathname = `/${currentPage}`;

    if (location.pathname !== pathname) {
      history.pushState({}, "", pathname);
      app.$({ path: location.pathname });

      const previousPage = location.pathname.split("/").at(1);
      //console.log('previousPage:', previousPage)///

      const residual = path.slice(1, -3).split("/").slice(2).join("/");
      //console.log("residual:", residual); ////

      const mod = await use(`@/${currentPage}.js`);
      await mod.default({ pathname, residual });
    }

    return this;
  }

  /* */
  async setup(home = "/") {
    this.set(home);
    return this;
  }
})();

/* */
window.addEventListener("popstate", async (event) => {
  const path = location.pathname === "/" ? "/" : `@${location.pathname}.js`;
  await instance.set(path);
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
