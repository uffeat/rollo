/* Lightweight version of `/src/use.js` intended for Anvil */

const typeName = (value) => Object.prototype.toString.call(value).slice(8, -1);

class Path {
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

    let parts = specifier.split("/");

    this.#_.source = parts.shift();

    if (parts.at(-1) === "") {
      parts[parts.length - 1] = `${parts[parts.length - 2]}.js`;
    }

    if (parts.includes("")) {
      const index = parts.findIndex((p) => p === "");
      const next = parts[index + 1];
      parts[index] = next.split(".")[0];
    }

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

  get detail() {
    return this.#_.detail;
  }

  get file() {
    return this.#_.file;
  }

  get full() {
    return this.#_.full;
  }

  get parts() {
    return this.#_.parts;
  }

  get path() {
    return this.#_.path;
  }

  get source() {
    return this.#_.source || "/";
  }

  /* Returns specifier. */
  get specifier() {
    return this.#_.specifier;
  }

  get stem() {
    return this.#_.stem;
  }

  get type() {
    return this.#_.type;
  }

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
    this.#_.meta = new (class Meta {
      #_ = {};

      constructor() {
        this.#_.companion = new (class {
          get origin() {
            return location.origin;
          }
        })();
      }

      get base() {
        return "https://rolloh.vercel.app";
      }

      get companion() {
        return this.#_.companion;
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

  async get(specifier, ...args) {
    const options = { ...(args.find((a) => typeName(a) === "Object") || {}) };
    args = args.filter((a) => typeName(a) !== "Object");
    const path = Path.create(specifier);
    let result;
    /* Import */
    if (!this.sources.has(path.source)) {
      throw new Error(`Invalid source: ${path.source}`);
    }
    result = await this.sources.get(path.source)(
      { options: { ...options }, owner: this, path },
      ...args,
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
        ...args,
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
        ...args,
      );
      /* Ignore undefined. */
      if (processed !== undefined) {
        result = processed;
      }
    }
    return result;
  }

  async import(u) {
    return this.#_.import(u);
  }

  async module(text, path) {
    if (path) {
      text = `${text}\n//# sourceURL=${path}`;
    }
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/javascript" }),
    );
    const result = await this.import(url);
    URL.revokeObjectURL(url);
    return result;
  }
})();

/** Register out-of-the-box sources. */

(() => {
  const cache = new Map();
  assets.sources.add("@", ({ path }) => {
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
      throw new Error(`Invalid path: ${path.full}`);
    }
    const result = atob(propertyValue.slice(1, -1));
    cache.set(path.full, result);
    return result;
  });
})();

/** Register out-of-the-box transformers and processors for native types. */

/* Add css support. */
assets.types
  .add(
    "css",
    (() => {
      const cache = new Map();
      return async (text, { path }) => {
        /* Type guard */
        if (!(typeof text === "string")) return;
        const { Sheet } = await assets.get("@/rollo/");
        const key = path.full;
        if (cache.has(key)) return cache.get(key);
        const result = Sheet.create(text, key);
        cache.set(key, result);
        return result;
      };
    })(),
  )
  .processors.add("css", async (result, options, ...args) => {
    /* Type guard */
    if (typeName(result) !== "CSSStyleSheet") return;
    const targets = args.filter(
      (a) =>
        typeName(a) === "HTMLDocument" ||
        a instanceof ShadowRoot ||
        a.shadowRoot,
    );
    if (targets.length) {
      /* NOTE sheet.use() adopts to document, therefore check targets' length */
      result.use(...targets);
    }
  });

/* Add js support. */
assets.types.add(
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
              path.path,
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
  })(),
);

/* Add json support. */
assets.types.add("json", (result) => {
  /* Type guard */
  if (!(typeof result === "string")) return;
  return JSON.parse(result);
});

Object.defineProperty(globalThis, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
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

/* Add carrier sheet */
await new Promise((resolve) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${assets.meta.base}/anvil/anvil.css`;
  link.onload = async () => {
    resolve(true);
  };
  document.head.append(link);
});
