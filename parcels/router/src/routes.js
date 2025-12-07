//import "../use.js";////

const { Exception } = await use("@/tools/exception");
const { type } = await use("@/tools/type");

const types = Object.freeze(
  new Set(["AsyncFunction", "Function", "Module", "Object"])
);

export class Routes {
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
