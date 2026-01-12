/* */
const type = (value) => Object.prototype.toString.call(value).slice(8, -1);

export class UseError extends Error {
  static raise = (message, callback) => {
    callback?.();
    throw new UseError(message);
  };
  static if = (predicate, message, callback) => {
    if (typeof predicate === "function") {
      predicate = predicate();
    }
    if (predicate) {
      UseError.raise(message, callback);
    }
  };
  constructor(message) {
    super(message);
    /* Hard-code name (rather than `this.name = this.constructor.name`) 
    to avoid obfuscation by minification */
    this.name = "UseError";
  }
}

export class Path {
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #_ = {
    detail: {},
  };

  constructor(specifier) {
    this.#_.specifier = specifier;

    const [path, search] = specifier.split("?");

    /* Build query */
    if (search) {
      this.#_.query = Object.freeze(
        Object.fromEntries(
          Array.from(new URLSearchParams(search), ([k, v]) => {
            v = v.trim();
            if (v === "") return [k, true];
            if (v === "true") return [k, true];
            const probe = Number(v);
            return [k, Number.isNaN(probe) ? v : probe];
          }).filter(([k, v]) => !["false", "null", "undefined"].includes(v))
        )
      );
    } else {
      this.#_.query = null;
    }

    let parts = path.split("/");

    this.#_.source = parts.shift();
    /* NOTE If specifier starts with '/', this.#_.source becomes '', which is 
    handy during construction. However, the this.source getter returns '/' for 
    falsy (i.e., '') this.#_.source values. */

    /** Handle shortcuts */

    /* Trailing '/' -> repeats last part with js type. Example: */
    () => "@/foo/" === "@/foo/foo.js";

    if (parts.at(-1) === "") {
      parts[parts.length - 1] = `${parts[parts.length - 2]}.js`;
    }
    /* '//' in path -> repeats next part without any types. Examples: */
    () => "/foo//bar.css" === "@/foo/foo.js";
    () => "@//foo.js" === "@/foo/foo.js";

    if (parts.includes("")) {
      const index = parts.findIndex((p) => p === "");
      const next = parts[index + 1];
      parts[index] = next.split(".")[0];
    }
    /* Missing type -> default to js */
    const file = parts.at(-1);
    if (file && !file.includes(".")) {
      parts[parts.length - 1] = `${file}.js`;
    }

    /** Build props */
    this.#_.parts = Object.freeze(parts);
    this.#_.path = `/${parts.join("/")}`;
    this.#_.full = `${this.#_.source}${this.#_.path}`;
    this.#_.file = parts.at(-1);
    if (this.#_.file) {
      this.#_.stem = this.#_.file.split(".").at(0);
      this.#_.type = this.#_.file.split(".").at(-1);
      const [_, ...types] = this.#_.file.split(".");
      this.#_.types = types.join(".");
    }
  }

  /* Returns detail for ad-hoc data.
  NOTE Can be critical for handlers. */
  get detail() {
    return this.#_.detail;
  }

  /* Returns file name with types(s). */
  get file() {
    return this.#_.file;
  }

  /* Returns full path (incl. source). */
  get full() {
    return this.#_.full;
  }

  /* Returns array of dir/file parts (source excluded). */
  get parts() {
    return this.#_.parts;
  }

  /* Returns path (source excluded, but always starting with '/'). */
  get path() {
    return this.#_.path;
  }

  /* Returns query. */
  get query() {
    return this.#_.query;
  }

  /* Returns source. */
  get source() {
    return this.#_.source || "/";
  }

  /* Returns specifier. */
  get specifier() {
    return this.#_.specifier;
  }

  /* Returns file stem. */
  get stem() {
    return this.#_.stem;
  }

  /* Returns declared file type. */
  get type() {
    return this.#_.type;
  }

  /* Returns string with pseudo files types and declared file type. */
  get types() {
    return this.#_.types;
  }
}

class Registry {
  #_ = {
    detail: {},
  };

  constructor(owner, registry) {
    this.#_.owner = owner;
    /* Allow passed-in registry for extension flexibility */
    this.#_.registry = registry ? registry : new Map();
  }

  get detail() {
    return this.#_.detail;
  }

  get owner() {
    return this.#_.owner;
  }

  get size() {
    return this.#_.registry.size;
  }

  add(key, value) {
    this.#_.registry.set(key, value);
    return this.owner;
  }

  get(key) {
    return this.#_.registry.get(key);
  }

  has(key) {
    return this.#_.registry.has(key);
  }

  keys() {
    return this.#_.registry.keys();
  }
}

export const assets = new (class Assets {
  #_ = {
    import: Function("u", "return import(u)"),
  };

  constructor() {
    const assets = this;

    this.#_.meta = new (class Meta {
      get base() {
        return "https://rolloh.vercel.app";
      }
    })();

    this.#_.sources = new Registry(this);
    this.#_.processors = new (class Processors extends Registry {
      #_ = {};
      constructor(owner) {
        const registry = new Map();
        super(owner, registry);
        this.#_.registry = registry;
      }

      add(...args) {
        const value = args.pop();
        for (const key of args) {
          this.#_.registry.set(key, value);
        }
        return this.owner;
      }
    })(this);

    this.#_.types = new Registry(this);

    Object.defineProperty(globalThis, "use", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: new Proxy(async () => {}, {
        get(target, key) {
          if (key === "assets") return assets;
          const value = assets[key];
          if (typeof value === "function") {
            return value.bind(assets);
          }
          return value;
        },
        set(target, key, value) {
          assets[key] = value;
          return true;
        },
        apply(target, thisArg, args) {
          return assets.get(...args);
        },
      }),
    });
  }

  get meta() {
    return this.#_.meta;
  }

  get processors() {
    return this.#_.processors;
  }

  get sources() {
    return this.#_.sources;
  }

  get types() {
    return this.#_.types;
  }

  async module(text, path) {
    if (path) {
      text = `${text}\n//# sourceURL=${path}`;
    }
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/javascript" })
    );
    const result = await this.#_.import(url);
    URL.revokeObjectURL(url);
    return result;
  }

  async get(specifier, ...args) {
    const options = { ...(args.find((a) => type(a) === "Object") || {}) };
    args = args.filter((a) => type(a) !== "Object");
    const path = Path.create(specifier);
    let result;
    /* Import */
    if (!this.sources.has(path.source)) {
      UseError.raise(`Invalid source: ${path.source}`);
    }
    result = await this.sources.get(path.source)(
      { options: { ...options }, owner: this, path },
      ...args
    );
    /* Escape */
    if (path.detail.escape) return result;
    /* Error */
    if (result instanceof Error) return result;
    /* Raw */
    if (options.raw) {
      if (options.spec) {
        return Object.freeze({
          path: path.full,
          source: path.source,
          text: result,
          type: path.type,
        });
      }
      return result;
    }
    /* Transform */
    if (path.detail.transform !== false && this.types.has(path.type)) {
      const transformer = this.types.get(path.type);
      const transformed = await transformer(
        result,
        { options: { ...options }, owner: this, path },
        ...args
      );
      /* Ignore undefined. */
      if (transformed !== undefined) {
        result = transformed;
      }
    }
    /* Process */
    if (path.detail.process !== false && this.processors.has(path.types)) {
      const processor = this.processors.get(path.types);
      const processed = await processor(
        result,
        { options: { ...options }, owner: this, path },
        ...args
      );
      /* Ignore undefined. */
      if (processed !== undefined) {
        result = processed;
      }
    }
    return result;
  }
})();

/** Register out-of-the-box sources. */

/* Register asset carrier sheet as source (@/). */
(() => {
  const cache = new Map();
  use.sources.add("@", ({ path }) => {
    if (cache.has(path.full)) {
      return cache.get(path.full);
    }
    const probe = document.createElement("meta");
    document.head.append(probe);
    probe.setAttribute("__path__", path.path);
    const propertyValue = getComputedStyle(probe)
      .getPropertyValue("--__asset__")
      .trim();
    probe.remove();
    if (!propertyValue) {
      UseError.raise(`Invalid path: ${path.full}`);
    }
    const result = atob(propertyValue.slice(1, -1));
    cache.set(path.full, result);
    return result;
  });
})();

/** Register out-of-the-box transformers and processors for native types. */

/* Add css support. */
use.types
  .add(
    "css",
    (() => {
      const cache = new Map();
      return async (text, { path }) => {
        /* Type guard */
        if (!(typeof text === "string")) return;
        const { Sheet } = await use("@/rollo/");
        const key = path.full;
        if (cache.has(key)) return cache.get(key);
        const result = Sheet.create(text, key);
        cache.set(key, result);
        return result;
      };
    })()
  )
  .processors.add("css", async (result, options, ...args) => {
    /* Type guard */
    if (type(result) !== "CSSStyleSheet") return;
    const targets = args.filter(
      (a) =>
        type(a) === "HTMLDocument" || a instanceof ShadowRoot || a.shadowRoot
    );
    if (targets.length) {
      /* NOTE sheet.use() adopts to document, therefore check targets' length */
      result.use(...targets);
    }
  });

/* Add support for conversion of html to component or array of components. */
use.processors.add(
  "html",
  "template",
  async (text, { options, owner, path }) => {
    /* Options guard guard */
    if (!options.convert) return;
    /* Type guard */
    if (!(typeof text === "string")) return;
    const { component } = await use("@/rollo/");
    return component.from(text);
  }
);

/* Add js support. */
use.types.add(
  "js",
  (() => {
    const cache = new Map();
    const constructing = new Map();
    return async (text, { options, owner, path }) => {
      /* Type guard */
      if (!(typeof text === "string")) return;
      let result;
      const { as } = options;
      const key = as === "function" ? `${path.full}?${as}` : path.full;
      if (cache.has(key)) {
        return cache.get(key);
      }
      if (constructing.has(key)) {
        const promise = constructing.get(key);
        const result = await promise;
        constructing.delete(key);
        return result;
      } else {
        const { promise, resolve, reject } = Promise.withResolvers();
        constructing.set(key, promise);
        try {
          if (as === "function") {
            result = Function(`return ${text}`)();
            if (result === undefined) {
              /* Since undefined results are ignored, convert to null */
              result = null;
            }
          } else {
            result = await owner.module(
              `export const __path__ = "${path.path}";${text}`,
              path.path
            );
          }
          resolve(result);
          cache.set(key, result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        } finally {
          constructing.delete(key);
        }
      }
    };
  })()
);

/* Add json support. */
use.types.add("json", (result) => {
  /* Type guard */
  if (!(typeof result === "string")) return;
  return JSON.parse(result);
});
