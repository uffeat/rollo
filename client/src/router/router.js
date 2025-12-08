import "@/use.js";
import { Exception } from "@/tools/exception.js";
import { type } from "@/tools/type.js";
import { ref, stateMixin  } from "@/state/state.js";
import { app } from "@/app/app.js";
import { Url } from "./url.js";
import { Mixins, author, mix } from "component";

await use("/router/router.css");


const types = Object.freeze(
  new Set(["AsyncFunction", "Function", "Module", "Object"])
);

class Routes {
  #_ = {
    registry: new Map(),
  };

  get size() {
    return this.#_.registry.size;
  }

  add(spec) {
    for (const [path, route] of Object.entries(spec)) {
      /* Type check */
      const _type = type(route);
      Exception.if(!types.has(_type), `Invalid route type: ${_type}`);
      Exception.if(
        (_type === "Module" || _type === "Object") &&
          route.default &&
          typeof route.default !== "function",
        `Invalid default member (expected a function; got type: ${_type})`,
        () => console.error(`default:`, route.default)
      );
      /* Register */
      this.#_.registry.set(path, { route });
    }
  }

  async get(path) {
    const detail = this.#_.registry.get(path);
    if (typeof detail.route === "function") {
      return detail.route;
    }
    /* Module or Object route -> run any setup and use default as route function */
    if (!detail.setup && typeof detail.route.setup === "function") {
      /* ensure that setup only runs once */
      detail.setup = true;
      await detail.route.setup(path);
    }
    if (typeof detail.route.default === "function") {
      /* Replace registered route
        NOTE Done by mutating detail - faster and cleaner than tinkering 
        with registry */
      detail.route = await detail.route.default();
      return detail.route;
    }
    return detail.route;
  }

  has(path) {
    return this.#_.registry.has(path);
  }

  remove(path) {
    return this.#_.registry.delete(path);
  }
}

const Router = new (class Router {
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

  /* Set route registration controller. */
  set routes(routes) {
    this.#_.routes = routes;
  }

  error(...args) {
    return this.#_.config.error(...args);
  }

  /* Invokes route from initial location. 
  NOTE Should be called once router has been set up. */
  async setup({ error, redirect, routes, strict = true } = {}) {
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
    NOTE Provides control over when state-pushing should take place. */
    const push = (() => {
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
    if (!push) {
      return this;
    }

    this.#_.session++;

    /* Returns undefined if no route found, otherwise a function that handles the route.
    NOTE Provides control over when the route should be handled. */
    const control = await (async () => {
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
          } else if (typeof route === "function") {
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
            } else if (typeof this.#_.route === "function") {
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
          } else if (typeof route === "function") {
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

    if (!control) {
      push();
      this.#signal(url.path, url.query);
      if (strict) {
        const message = `Invalid path: ${url.path}`;
        if (this.#_.config.error) {
          this.#_.config.error(message);
        } else {
          throw new Error(message);
        }
      }
      return this;
    }

    push();
    await control();
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
    if (residual.length) {
      path = `${path}/${residual.join("/")}`;
    }
    app.$({ path });
    this.#_.states.path(path, {}, query, ...residual);
  }

  #specifierFromLocation() {
    return location.search
      ? `${location.pathname}${location.search}${location.hash}`
      : `${location.pathname}${location.hash}`;
  }
})();


/* Proxy version with leaner syntax  */
const router = new Proxy(async () => {}, {
  get(target, key) {
    if (key === "router") {
      return Router;
    }
    Exception.if(!(key in Router), `Invalid key: ${key}`);
    const value = Router[key];
    if (typeof value === "function") {
      return value.bind(Router);
    }
    return value;
  },
  set(target, key, value) {
    Exception.if(!(key in Router), `Invalid key: ${key}`);
    Router[key] = value;
    return true;
  },
  apply(target, thisArg, args) {
    return Router.use(...args);
  },
  deleteProperty(target, key) {
    Router.routes.remove(key);
  },
  has(target, key) {
    return Router.routes.has(key);
  },
});


const TAG = "a";
const NavLink = author(
  class extends mix(
    document.createElement(TAG).constructor,
    {},
    ...Mixins(stateMixin)
  ) {
    #_ = {};
    constructor() {
      super();
      this.attribute.webComponent = true;
      this.attribute[this.constructor.__key__] = true;

      this.on.click = async (event) => {
        if (this.path) {
          event.preventDefault();
          const specifier = this.#_.query
            ? this.path + Query.stringify(this.#_.query)
            : this.path;
          await router(specifier);
        }
      };
    }

    get path() {
      return this.attribute.path;
    }

    set path(path) {
      this.attribute.path = path;
    }

    get query() {
      if (this.#_.query) {
        return Object.freeze({ ...this.#_.query });
      }
    }

    set query(query) {
      this.#_.query = query;
    }

    get selected() {
      return this.attribute.selected || false;
    }

    set selected(selected) {
      this.attribute.selected = selected;
    }
  },
  "nav-link",
  TAG
);

const Nav = (nav) => {
  router.effects.add(
    (path) => {
      const previous = nav.find(`.active`);
      if (previous) {
        previous.classes.remove('active');
      }
      const current = nav.find(`[path="${path}"]`);
      if (current) {
        current.classes.add('active');
      }
    },
    (path) => !!path
  );
  return nav;
};



export {Nav, NavLink, router}