import { Path, Registry, UseError, meta, typeName } from "./tools";

const assets = new (class Assets {
  #_ = {
    added: new Map(),
    detail: {},
    // Rebuild native 'import' to prevent Vite from barking
    import: Function("u", "return import(u)"),
  };

  constructor() {
    // Compose meta
    this.#_.meta = meta;
    // Compose sources
    this.#_.sources = new Registry(this);
    // Compose processors 
    // NOTE Extends Registry to allow registering multiple types in one go.
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
    // Compose types 
    this.#_.types = new Registry(this);
  }

  /* . */
  get anvil() {
    return this.#_.anvil;
  }

  /* . */
  set anvil(anvil) {
    this.#_.anvil = anvil;
  }

  /* Returns detail for ad-hoc data. */
  get detail() {
    return this.#_.detail;
  }

  /* Returns meta. */
  get meta() {
    return this.#_.meta;
  }

  /* Returns processors controller. */
  get processors() {
    return this.#_.processors;
  }

  /* Returns sources controller. */
  get sources() {
    return this.#_.sources;
  }

  /* Returns types controller. */
  get types() {
    return this.#_.types;
  }

  /* Injects asset. 
  NOTE Inteded for overloading when testing parcels. */
  add(key, value) {
    this.#_.added.set(key, value);
    return this;
  }

  /* Defines getter. */
  compose(name, composition) {
    Object.defineProperty(this, name, {
      configurable: true,
      enumerable: false,
      get() {
        return composition;
      },
    });
    return this;
  }

  /* Returns and processes asset. */
  async get(specifier, ...args) {
    const options = { ...(args.find((a) => typeName(a) === "Object") || {}) };
    args = args.filter((a) => typeName(a) !== "Object");

    const path = Path.create(specifier);
    let result;
    // Import
    if (this.#_.added.has(path.full)) {
      // Added assets
      result = this.#_.added.get(path.full);
      if (typeof result === "function") {
        result = await result({ path });
      }
    } else {
      // Get assets from registered source (nothing from added)
      if (!this.sources.has(path.source)) {
        UseError.raise(`Invalid source: ${path.source}`);
      }
      result = await this.sources.get(path.source)(
        { options: { ...options }, owner: this, path },
        ...args,
      );
    }
    // Escape
    if (path.detail.escape) return result;
    // Error
    if (result instanceof Error) return result;
    // Raw
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
    // Transform
    if (path.detail.transform !== false && this.types.has(path.type)) {
      const transformer = this.types.get(path.type);
      const transformed = await transformer(
        result,
        { options: { ...options }, owner: this, path },
        ...args,
      );
      // Ignore undefined
      if (transformed !== undefined) {
        result = transformed;
      }
    }
    // Process
    if (path.detail.process !== false && this.processors.has(path.types)) {
      const processor = this.processors.get(path.types);
      const processed = await processor(
        result,
        { options: { ...options }, owner: this, path },
        ...args,
      );
      // Ignore undefined
      if (processed !== undefined) {
        result = processed;
      }
    }
    return result;
  }

  /* Returns module (native 'import' frunction) */
  async import(u) {
    return this.#_.import(u);
  }

  /* Returns uncached constructed module. */
  // NOTE Provided as a service to handlers.
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

// Repackage 'assets' to 'use' callable
const use = new Proxy(async () => {}, {
  get(target, key) {
    if (key === "assets") {
      return assets;
    }
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
});

// Make 'use' global 
// NOTE In DEV (only), global 'use' can be changed.
Object.defineProperty(globalThis, "use", {
  configurable: assets.meta.DEV,
  enumerable: true,
  writable: assets.meta.DEV,
  value: use,
});

window.dispatchEvent(new CustomEvent("_use"));

// NOTE Really no need to export 'use' (since global),
// but silences linters.
export { assets, use };
