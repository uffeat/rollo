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
      const _type = type(route);

      Exception.if(!types.has(_type), `Invalid route type: ${_type}`);

      if (_type === "Module" || _type === "Object") {
        Exception.if(
          route.default !== "function",
          `Invalid default member`,
          console.error(`default:`, route.default)
        );
      }

      this.#_.registry.set(path, { route, type: _type });
    }
  }

  async get(path) {
    const detail = this.#_.registry.get(path);

    if (detail.type === "Module" || detail.type === "Object") {
    }

    if (type(detail.route) === "Object" && typeof detail.route === "function") {
      detail.route = await detail.route.default();
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
