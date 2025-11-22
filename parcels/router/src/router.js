import { Config } from "./config.js";
import { Routes } from "./routes.js";
import { States } from "./states.js";
import { Url } from "./url.js";

const { app } = await use("@/app/");
const { Exception } = await use("@/tools/exception.js");

export const Router = new (class Router {
  #_ = {
    route: async () => {},
    routes: null,
    session: 0,
    states: {},
    url: null,
  };

  constructor() {
    this.#_.config = new Config();
    this.#_.routes = new Routes();
    this.#_.states = new States(this);
  }

  get config() {
    return this.#_.config;
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
  async setup({ controller = true, strict = true } = {}) {
    if (!this.#_.initialized) {
      /* Enable back/forward navigation */
      window.addEventListener("popstate", async (event) => {
        await this.use(this.#specifierFromLocation(), {
          context: "pop",
          controller,
          strict
        });
      });

      /* Handle initial */
      await this.use(this.#specifierFromLocation(), {
        context: "setup",
        strict,
        controller,
      });

      this.#_.initialized = true;
    }
    return this;
  }

  /* Invokes route. */
  async use(specifier, { context, controller = true, strict = true } = {}) {
    const url = Url.create(specifier);
    /* Determine if need to push state */
    if (this.url) {
      if (!url.match(this.url)) {
        /* Change -> push */
        this.#_.url = url;
        if (!context) {
          this.#pushState(url);
        }
      } else {
        /* No change -> abort */
        return this;
      }
    } else {
      /* Initial -> push */
      this.#_.url = url;
      if (!context) {
        console.log("initial"); ////

        this.#pushState(url);
      }
    }
    this.#_.session++;

    if (controller) {
      const { path, residual, route } = (await this.#getRoute(url.path)) || {};
      if (route) {
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
      } else {
        if (strict) {
          this.#_.route = null;
          if (!this.config.error) {
            Exception.if(use.meta.DEV, `Invalid path: ${url.path}`);
            console.warn(`Invalid path: ${url.path}`);
            return this;
          }
          await this.config.error(url.path);
        }
      }
    } else {
      /* Enable external hooks etc. */
      app.$({ path: url.path });
      this.#_.states.path(url.path, {}, url.query);
    }

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
        const route = (await use(`${source}pages/${path}.x.html`))();
        return { path, route, residual: [] };
      } catch (error) {
        if (error.name !== 'UseError') {
          throw error
        }
        /* Do nothing, so that next source can be tried */
      }
    }
    /* If we get here, all fallbacks failed */
  }

  #pushState(url) {
    history.pushState({}, "", url.full);
  }

  #specifierFromLocation() {
    return location.search
      ? `${location.pathname}${location.search}${location.hash}`
      : `${location.pathname}${location.hash}`;
  }
})();
