const { app } = await use("@/app/");
const { reactive, ref } = await use("@/state.js");
const { Exception } = await use("@/tools/exception.js");

export const Router = new (class Router {
  #_ = {
    path: {},
    query: {},
    route: {},
    routes: null,
    session: 0,
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

      get size() {
        return this.#_.registry.size;
      }

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

      remove(path) {
        return this.#_.registry.delete(path);
      }
    })();

    //this.#_.states.path = ref({ owner: this, name: "router" });
    this.#_.states = {
      path: ref({ owner: this, name: "router" }),
      query: reactive({}, { owner: this, name: "router" }),
    };

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

  /* Returns current and previous full path. */
  get path() {
    return Object.freeze({ ...this.#_.path });
  }

  /* Returns current and previous query. */
  get query() {
    return Object.freeze({ ...this.#_.query });
  }

  /* Returns current and previous route. */
  get route() {
    return Object.freeze({ ...this.#_.route });
  }

  /* Returns route registration controller. */
  get routes() {
    return this.#_.routes;
  }

  get session() {
    return this.#_.session;
  }

  /* Invokes route. */
  async use(path, { hash = false, search = false, silent = false } = {}) {
    if (path === this.#_.path.current) return;

    /* Update internals */
    this.#_.session++;
    this.#_.path.previous = this.#_.path.current;
    this.#_.path.current = path;

    if (silent === false) {
      history.pushState({}, "", path);
    }

    const query = this.#query(path);
    this.#_.query.previous = this.#_.query.current;
    this.#_.query.current = query;

    /* Update states, so that external code can use effects to update 
    active links etc. */
    this.#_.states.path(path);
    this.#_.states.query({ query });

    /* Parse path to extrat registered path and residual */
    const parsed = this.#parse(path);
    /* Prepare message for route */
    const message = {
      query,
      router: this,
      session: this.#_.session,
      silent,
    };

    /** Handle invalid path */
    if (!parsed) {
      if (!this.config.error) {
        Exception.if(use.meta.DEV);
        console.warn(`Invalid path:`, path);
        return this;
      }
      await this.config.error({
        change: true,
        path,
        residual: path,
        route: this.config.error,
        ...message,
      });
      return this;
    }

    /** Handle valid path */
    path = parsed.path;
    /* Expose current path as app attr; can be used for styling */
    app.$({ path });
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
      this.#_.route.previous = this.#_.route.current;
      this.#_.route.current = route;
      await route({ change: true, ...message });
    }
    return this;
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

  #query(path) {
    const query = Object.freeze(
      Object.fromEntries(
        Array.from(new URLSearchParams(window.location.search), ([k, v]) => {
          v = v.trim();
          if (v === "") return [k, true];
          const probe = Number(v);
          return [k, Number.isNaN(probe) ? v : probe];
        })
      )
    );
    /* Or with helper:
    const query = Object.freeze(
      Object.fromEntries(
        new URLSearchParams(window.location.search).entries().map(([k, v]) => {
          v = v.trim();
          if (v === "") return [k, true];
          const probe = Number(v);
          return [k, Number.isNaN(probe) ? v : probe];
        })
      )
    );
    console.log("query:", query);
    

    */
    return query;
  }
})();
