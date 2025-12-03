import "../use.js";
import { Routes } from "./routes.js";
import { Url } from "./url.js";
import defaultError from './error.js'


const { app } = await use("@/app/");
const { ref } = await use("@/state");

export const Router = new (class Router {
  #_ = {
    config: { redirect: {} },
    session: 0,
  };

  constructor() {
    this.#_.routes = new Routes();

    this.#_.states = {
      path: ref({ owner: this, name: "path" }),
    };
  }

  /* Returns effects controller. */
  get effects() {
    return this.#_.states.path.effects;
  }

  /* Returns route registration controller. */
  get routes() {
    return this.#_.routes;
  }

  error(...args) {
    return this.#_.config.error(...args)
  }

  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ error = defaultError, redirect, routes, strict = true } = {}) {
    this.#_.config.error = error;
    this.#_.config.strict = strict;
    Object.assign(this.#_.config.redirect, redirect);

    if (routes) {
      this.routes.add({ ...routes });
    }

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
    if (specifier in this.#_.config.redirect) {
      specifier = this.#_.config.redirect[specifier];
    }

    
    strict = strict === undefined ? this.#_.config.strict : strict;

    const url = Url.create(specifier);

    /* Returns undefined if no url change, otherwise a function that pushes state.
    NOTE Provides control over when the state-pushing should take place. */
    const pusher = (() => {
      if (this.#_.url) {
        if (!url.match(this.#_.url)) {
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
        if (route === this.#_.route) {
          /* Route update */
          if (route.update) {
            await route.update(
              { session: this.#_.session },
              url.query,
              ...residual
            );
          } else {
            await route(
              { mode: "update", session: this.#_.session, update: true },
              url.query,
              ...residual
            );
          }
        } else {
          /* Route change */
          if (this.#_.route) {
            /* Route exit 
            NOTE Never residual on exit */
            if (this.#_.route.exit) {
              await this.#_.route.exit({ session: this.#_.session });
            } else {
              await this.#_.route({
                exit: true,
                mode: "exit",
                session: this.#_.session,
              });
            }
          }
          /* Route enter */
          if (route.enter) {
            await route.enter(
              { session: this.#_.session },
              url.query,
              ...residual
            );
          } else {
            await route(
              { enter: true, mode: "enter", session: this.#_.session },
              url.query,
              ...residual
            );
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
        this.#_.config.error(url.path);
      }
      return this;
    }

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
        const route = await this.routes.get(probe);
        return { path: probe, route, residual };
      }
    }
   
  }

  /* Enables external hooks etc. */
  #signal(path, query, ...residual) {
    app.$({ path });
    this.#_.states.path(path, {}, query, ...residual);
  }

  #specifierFromLocation() {
    return location.search
      ? `${location.pathname}${location.search}${location.hash}`
      : `${location.pathname}${location.hash}`;
  }
})();
