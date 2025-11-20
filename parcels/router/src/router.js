const { ref } = await use("@/state.js");
const { Exception } = await use("@/tools/exception.js");

export const Router = new (class Router {
  #_ = {
    path: {},
    route: {},
    routes: null,
    session: 0,
    states: {},
  };

  constructor() {
    const router = this;

    this.#_.config = new (class Config {
      #_ = {};

      constructor() {
        /* Default error route */
        this.#_.error = async (...args) => {
          const mod = await use("/pages/error.js");
          mod.default(...args);
        };
      }

      get error() {
        return this.#_.error;
      }

      set error(route) {
        this.#_.error = route;
      }
    })();

    this.#_.routes = new (class Routes {
      #_ = {
        registry: new Map(),
      };

      constructor() {}

      add(spec) {
        for (const [path, route] of Object.entries(spec)) {
          this.#_.registry.set(path, route);
        }
      }

      get(path) {
        return this.#_.registry.get(path);
      }

      has(path) {
        return this.#_.registry.has(path);
      }
    })();

    this.#_.states.path = ref({ owner: this, name: "router" });

    this.#_.effects = new Proxy(
      {},
      {
        get(target, key) {
          Exception.if(!(key in router.#_.states), `Invalid key: ${key}.`);
          return router.#_.states[key].effects;
        },
      }
    );

    window.addEventListener("popstate", async (event) => {
      await this.use(location.pathname, { silent: true });
    });
  }

  get config() {
    return this.#_.config;
  }

  get effects() {
    return this.#_.effects;
  }

  get routes() {
    return this.#_.routes;
  }

  async use(path, { silent = false } = {}) {
    if (path === this.#_.path.current) return;
    this.#_.session++;
    this.#_.path.previous = this.#_.path.current;
    this.#_.path.current = path;

    if (silent === false) {
      history.pushState({}, "", path);
    }

    /* Update path state, so that external code can use effects to update 
    active links etc. */
    this.#_.states.path(path);

    const parsed = this.#parse(path);

    const message = {
      router: this,
      session: this.#_.session,
      silent,
    };

    /** Handle invalid path */
    if (!parsed) {
      if (!this.config.error) {
        Exception.if(use.meta.DEV);
        console.warn(`Invalid path:`, path);
        return;
      }

      await this.config.error(
        {
          change: true,
          path,
          residual: path,
          route: this.config.error,
          ...message,
        },
      );
      return;
    }

    /** Handle valid path */

    path = parsed.path;
    const route = this.routes.get(path);

    Object.assign(message, { path, residual: parsed.residual, route });

    /* Check if new route */
    if (route === this.#_.route.current) {
      /* route not new -> inform route that no change and provide tail for 
      updates */
      await route({ change: false, ...message });
    } else {
      /* New route -> inform route that new and provide tail for 
      updates */
      this.#_.route.previous = this.#_.path.current;
      this.#_.route.current = route;
      await route({ change: true, ...message });
    }
  }

  #parse(path) {
    const parts = path.slice(1).split("/");
    for (let index = parts.length - 1; index >= 0; index--) {
      path = `/${parts.slice(0, index + 1).join("/")}`;
      if (this.routes.has(path)) {
        const residual = `${parts.slice(index + 1).join("/")}`;
        return { path, residual };
      }
    }
  }
})();

/* Proxy version with leaner syntax  */
export const router = new Proxy(async () => {}, {
  get(target, key) {
    const value = Router[key];
    if (typeof value === "function") {
      return value.bind(Router);
    }
    return value;
  },
  apply(target, thisArg, args) {
    return Router.use(...args);
  },
});
