import "../use.js";
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

    //console.log("specifier:", specifier);////

    const url = Url.create(specifier);

    //console.log("url.query:", url.query);////

    /* Returns undefined if no url change, otherwise a function that pushes state.
    NOTE Provides control over when the state-pushing should take place. */
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

    this.#_.session++;

    /* Returns undefined if no route found, otherwise a function that handles the route.
    NOTE Provides control over when the route should be handled. */
    const controller = await (async () => {
      const { path, residual, route } = (await this.#getRoute(url.path)) || {};
      if (!route) {
        this.#_.route = null;
        return;
      }
      return async () => {
        this.#signal(path, url.query, ...residual);
        if (route === this.route) {
          /* Route update */
          if (route.update) {
            await route.update(url.query, ...residual);
          } else {
            await route({ update: true }, url.query, ...residual);
          }
        } else {
          /* Route change */
          if (this.route) {
            /* Route exit */
            if (this.route.exit) {
              await this.route.exit();
            } else {
              await this.route({ exit: true });
            }
          }
          /* Route enter */
          if (route.enter) {
            await route.enter(url.query, ...residual);
          } else {
            await route({ enter: true }, url.query, ...residual);
          }

          /* Update active route */
          this.#_.route = route;
        }
      };
    })();

    if (!controller) {
      pusher();

      this.#signal(url.path, url.query);

      if (strict) {
        if (!this.#_.config.error) {
          this.#_.config.error = (await use("/pages/error.js")).default;
        }
        await this.#_.config.error(url.path);
      }
      return this;
    }

    pusher();
    await controller();
    return this;
  }

  /* Enables external hooks etc. */
  #signal(path, query, ...residual) {
    app.$({ path });
    this.#_.states.path(path, {}, query, ...residual);
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
