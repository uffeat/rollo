const { Reactive, Ref, ref, reactive } = await use("@/state.js");
const { Exception } = await use("@/tools/exception.js");

export const router = new (class Router {
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

    this.#_.states.path = Ref.create({ owner: this, name: "router" });

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

    /* Update path state, so that external code can use effects to update active links etc. */
    this.#_.states.path.update(path);

    // TODO Handle invalid route

    const [head, tail] = (() => {
      const parts = path.slice(1).split("/");
      for (let index = parts.length - 1; index >= 0; index--) {
        //console.log("index:", index);
        const probe = `/${parts.slice(0, index + 1).join("/")}`;
        //console.log("probe:", probe);
        if (this.routes.has(probe)) {
          return [probe, `${parts.slice(index + 1).join("/")}`];
        }
        //return ["*", path];
      }
    })();

    //console.log("head:", head);
    //console.log("tail:", tail);

    const route = this.routes.get(head);

    /* Check if new route */
    if (route === this.#_.route.current) {
      /* route not new -> inform route that no change and provide tail for 
      updates */
      await route({ change: false, path: head, route, router: this }, tail);
    } else {
      /* New route -> inform route that new and provide tail for 
      updates */
      this.#_.route.previous = this.#_.path.current;
      this.#_.route.current = route;
      await route(
        {
          change: true,
          path: head,
          route,
          router: this,
          session: this.#_.session,
          silent,
        },
        tail
      );
    }
  }
})();

/* TODO proxy version  */
