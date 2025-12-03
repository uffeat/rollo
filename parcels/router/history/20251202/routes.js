import "../use.js";

const { Exception } = await use("@/tools/exception");
const { type } = await use("@/tools/type");

const types = new Set(["AsyncFunction", "Function", "Module", "Object"]);

export class Routes {
  static create = (...args) => new Routes(...args);

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
    /* Module or Object route -> use default as route function */
    if (typeof detail.route.default === "function") {
      detail.route = await detail.route.default();
      return detail.route;
    }
  }

  has(path) {
    return this.#_.registry.has(path);
  }

  remove(path) {
    return this.#_.registry.delete(path);
  }
}
