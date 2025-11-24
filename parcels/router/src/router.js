import { Routes } from "./routes.js";
import { States } from "./states.js";
import { Url } from "./url.js";

const { app } = await use("@/app/");

export const Router = new (class Router {
  #_ = {
    config: {},
    route: async () => {},
    routes: null,
    session: 0,
    states: {},
    url: null,
  };

  constructor() {
    this.#_.routes = new Routes();
    this.#_.states = new States(this);
  }

  get config() {
    return Object.freeze({ ...this.#_.config });
  }

  /* Returns multi-state effect controller. */
  get effects() {
    return this.#_.states.effects;
  }

  /* Returns current route. */
  get route() {
    return this.#_.route;
  }

  /* Returns route registration controller. */
  get routes() {
    return this.#_.routes;
  }

  /* Returns session uid. */
  get session() {
    return this.#_.session;
  }

  /* Returns info about current: 
  - path: pathname
  - query: search as object
  - hash: hash
  - full: href without host
  */
  get url() {
    return this.#_.url;
  }

  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ error, strict = true } = {}) {
    
    this.#_.config.error = error;
    this.#_.config.strict = strict;

    if (!this.#_.initialized) {
      /* Enable back/forward navigation */
      window.addEventListener("popstate", async (event) => {
        await this.use(this.#specifierFromLocation(), {
          context: "pop",
        });
      });

      /* Handle initial */
      await this.use(this.#specifierFromLocation(), {
        context: "setup",
      });

      this.#_.initialized = true;
    }
    return this;
  }

  /* Invokes route. */
  async use(specifier, { context, strict } = {}) {
    strict = strict === undefined ? this.#_.config.strict : strict;

    const url = Url.create(specifier);

    const pusher = (() => {
      if (this.url) {
        if (!url.match(this.url)) {
          /* Change */
          this.#_.url = url;
          return () => {
            if (!context) {
              history.pushState({}, "", url.full);
            }
          };
        } else {
          /* No change */
          return;
        }
      } else {
        /* Initial */
        this.#_.url = url;
        return () => {
          if (!context) {
            history.pushState({}, "", url.full);
          }
        };
      }
    })();

    /* Abort if no change */
    if (!pusher) {
      return this;
    }

    const controller = await (async () => {
      const { path, residual, route } = (await this.#getRoute(url.path)) || {};
      if (!route) {
        return;
      }
      return async () => {
        /* Enable external hooks etc. */
        app.$({ path });
        this.#_.states.path(path, {}, url.query);

        if (route === this.route) {
          /* Mode: update -> call route with update */
          await route({ update: true }, url.query, ...residual);
        } else {
          /** Mode: new */
          /* Call any previous route with exit */
          if (this.route) {
            await this.route({ exit: true });
          }
          /* Call new route with enter */
          await route({ enter: true }, url.query, ...residual);
          /* Expose active route */
          this.#_.route = route;
        }
      };
    })();

    if (!controller) {
      if (strict) {
        if (!this.#_.config.error) {
          this.#_.config.error = (await use("/pages/error.js")).default;
        }
        this.#_.session++;
        pusher();
        this.#_.route = null;
        /* Enable external hooks etc. */
        app.$({ path: url.path });
        this.#_.states.path(url.path, {}, url.query);
        await this.#_.config.error(url.path);
      }

      return this;
    }

    this.#_.session++;

    pusher();
    await controller();
    return this;
  }

  async #getRoute(path) {
    const parts = path.slice(1).split("/");
    for (let index = parts.length - 1; index >= 0; index--) {
      const probe = `/${parts.slice(0, index + 1).join("/")}`;
      if (this.routes.has(probe)) {
        const residual = parts.slice(index + 1);
        const route = this.routes.get(probe);
        return { path: probe, route, residual };
      }
    }
    /* Fallback to '.x.'-asset if no registered route found */
    for (const source of ["/", "@/", "@@/"]) {
      try {
        const route = (await use(`${source}pages${path}.x.html`))();
        return { path, route, residual: [] };
      } catch (error) {
        if (error.name !== "UseError") {
          throw error;
        }
        /* Do nothing; move on to next source */
      }
    }
    /* If we get here, all fallbacks failed */
  }

  #specifierFromLocation() {
    return location.search
      ? `${location.pathname}${location.search}${location.hash}`
      : `${location.pathname}${location.hash}`;
  }
})();
