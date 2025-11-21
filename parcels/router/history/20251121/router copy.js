import { mode } from "./mode.js";
import { Url } from "./url.js";

const { app } = await use("@/app/");
const { reactive, ref } = await use("@/state.js");
const { Exception } = await use("@/tools/exception.js");


export const Router = new (class Router {
  #_ = {
    path: "",
    residual: [],
    route: async () => {},
    routes: new (class {})(),
    session: 0,
    states: {},
    url: null,
  };

  constructor() {
    const router = this;

    this.#_.config = new (class Config {
      #_ = {};

      constructor() {
        /* Default error route */
        this.#_.error = async (path) => {
          const mod = await use("/pages/error.js");
          mod.default(path);
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

    this.#_.states = {
      path: ref({ owner: this, name: "path" }),
      query: reactive({}, { owner: this, name: "query" }),
      residual: ref({ owner: this, name: "residual" }),
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
      await this.use(this.#specifier(), {
        context: "pop",
      });
    });
  }

  get config() {
    return this.#_.config;
  }

  get effects() {
    return this.#_.effects;
  }

  get path() {
    return this.#_.path;
  }

  get residual() {
    return this.#_.residual;
  }

  /* Returns . */
  get route() {
    return this.#_.route;
  }

  /* Returns route registration controller. */
  get routes() {
    return this.#_.routes;
  }

  get session() {
    return this.#_.session;
  }

  get url() {
    return this.#_.url;
  }

  async setup() {
    if (!this.#_.initialized) {
      await this.use(this.#specifier(), {
        context: "setup",
      });
      this.#_.initialized = true;
    }
    return this;
  }

  /* Invokes route. */
  async use(specifier, { context } = {}) {
    const url = Url.create(specifier);
    /* Determine if push state */
    if (this.url) {
      if (!url.match(this.url)) {
        //console.log("Change!");////
        this.#_.url = url;
        if (!context) {
          this.#push(url)
         
        }
      } else {
        /* No change -> abort */
        return this;
      }
    } else {
      //console.log("New!");////
      this.#_.url = url;
      if (!context) {
        this.#push(url)
      }
    }

    this.#_.session++;

    /* Deal with route */
    const parsed = this.#parse(url.path);
    //console.log('parsed:', parsed)////
    if (parsed) {
      const { path, residual } = parsed;

      /* Expose current path as app attr; can be used for styling */
      app.$({ path });

      /* */
      this.#_.path = path;
      this.#_.residual = Object.freeze(residual);

      /* */
      this.#_.states.path(path);
      this.#_.states.query(url.query);
      this.#_.states.residual(residual);

      const route = this.routes.get(path);
      //console.log("route:", route); ////
      if (route === this.route) {
        /* Mode: update -> call route with update */
        await route(mode.update, url.query, ...residual);
      } else {
        /** Mode: new */
        /* Call any previous route with exit */
        if (this.route) {
          await this.route(mode.exit);
        }
        /* Call new route with enter */
        await route(mode.enter, url.query, ...residual);

        this.#_.route = route;
      }
    } else {
      // Invalid route
      if (!this.config.error) {
        Exception.if(use.meta.DEV, `Invalid path: ${url.path}`);
        console.warn(`Invalid path: ${url.path}`);
        return this;
      }
      await this.config.error(url.path);
    }

    return this;
  }

  #parse(path) {
    const parts = path.slice(1).split("/");
    for (let index = parts.length - 1; index >= 0; index--) {
      path = `/${parts.slice(0, index + 1).join("/")}`;
      if (this.routes.has(path)) {
        const residual = parts.slice(index + 1);
        return { path, residual };
      }
    }
  }

  #push(url) {
    history.pushState({}, "", url.full);
  }

  #specifier() {
    return location.search
      ? `${location.pathname}${location.search}${location.hash}`
      : `${location.pathname}${location.hash}`;
  }
})();
