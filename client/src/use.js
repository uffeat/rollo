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

/* Utility for parsing path.
NOTE 
- Query support currently not used, but could be an alternative to option args.
*/
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
    if (!file.includes(".")) {
      parts[parts.length - 1] = `${file}.js`;
    }

    /** Build props */
    this.#_.parts = Object.freeze(parts);
    this.#_.path = `/${parts.join("/")}`;
    this.#_.full = `${this.#_.source}${this.#_.path}`;
    this.#_.file = parts.at(-1);
    this.#_.stem = this.#_.file.split(".").at(0);
    this.#_.type = this.#_.file.split(".").at(-1);
    const [_, ...types] = this.#_.file.split(".");
    this.#_.types = types.join(".");
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

/* Base for composed registries */
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

class Redirects {
  #_ = {
    registry: new Set(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  add(test) {
    this.#_.registry.add(test);
    return this.#_.owner;
  }

  async redirect(specifier, options, ...args) {
    for (const test of this.#_.registry.values()) {
      const result = await test(specifier, options, ...args);
      if (result) {
        return result;
      }
    }
    return specifier;
  }
}

/* Import engine. 
- Provides dynamic imports.
- Supports a range of asset types from different sources out-of-the-box.
- Can be extended with respect to sources, types and processors.
*/
export const assets = new (class Assets {
  #_ = {
    added: new Map(),
    detail: {},
    /* Rebuild native 'import' to prevent Vite from barking */
    import: Function("u", "return import(u)"),
  };

  constructor() {
    const assets = this;
    /* Compose meta */
    this.#_.meta = new (class Meta {
      #_ = {
        detail: {},
      };

      constructor() {
        const PORT = "3869";
        /* NOTE Refraining from using Vite's `import.meta.env.DEV` 
        makes consumption in a non-Vite context possible. */
        this.#_.DEV = location.hostname === "localhost";
        this.#_.base = "";
        if (this.DEV && location.port !== PORT) {
          this.#_.base = `http://localhost:${PORT}`;
        }
        /* NOTE Port-aware base allows access to public when testing parcels. */
        this.#_.VITE =
          typeof import.meta !== "undefined" &&
          typeof import.meta.env !== "undefined" &&
          import.meta.env.MODE;
      }

      get DEV() {
        return this.#_.DEV;
      }

      /* Returns flag that indicates if run in Vite env. */
      get VITE() {
        return this.#_.VITE;
      }

      /* Returns prefix for access to public. */
      get base() {
        return this.#_.base;
      }

      get detail() {
        return this.#_.detail;
      }

      get origin() {
        return location.origin;
      }
    })();
    /* Compose redirects */
    this.#_.redirects = new Redirects(this);
    /* Compose sources */
    this.#_.sources = new Registry(this);
    /* Compose processors 
    NOTE Extends Registry to allow registering multiple types in one go. */
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
    /* Compose types */
    this.#_.types = new Registry(this);
    /* Repackage 'assets' to global 'use' callable 
    NOTE In DEV (only), global 'use' can be changed. */
    Object.defineProperty(globalThis, "use", {
      configurable: assets.meta.DEV,
      enumerable: true,
      writable: assets.meta.DEV,
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

  /* Returns detail for ad-hoc data. */
  get detail() {
    return this.#_.detail;
  }

  /* Returns meta. */
  get meta() {
    return this.#_.meta;
  }

  /* Returns processors controller. 
  NOTE Operates on 'path.types'. */
  get processors() {
    return this.#_.processors;
  }

  /* Returns redirects controller. 
  NOTE Only kicks in in DEV, since redirect are expensive. */
  get redirects() {
    return this.#_.redirects;
  }

  /* Returns sources controller. 
  NOTE Operates on 'path.source'. */
  get sources() {
    return this.#_.sources;
  }

  /* Returns types controller
  NOTE Operates on 'path.type'. */
  get types() {
    return this.#_.types;
  }

  /* Injects asset. 
  NOTE Useful for
  - manually making objects use-importable (only for special cases)
  - overloading asset when testing parcels (knock yourself out!). */
  add(key, value) {
    if (typeof key === "string") {
      this.#_.added.set(key, value);
    } else {
      /* key assumed to be a plain object */
      for (const [k, v] of Object.entries(key)) {
        this.add(k, v);
      }
    }
    return this;
  }

  /* Returns uncached constructed module.
  NOTE Provided as a service to handlers. */
  async module(text, path) {
    if (path) {
      text = `${text}\n//# sourceURL=${path}`;
    }
    const url = URL.createObjectURL(
      new Blob([text], {
        type: "text/javascript",
      })
    );
    const result = await this.#_.import(url);
    URL.revokeObjectURL(url);
    return result;
  }

  /* Returns asset.
  NOTE 
  - Import engine centerpiece.
  - "Standard" flow:
    1. Get asset text from source as per registered source handler.
    2. Transform asset text to asset as per registered type handler.
    3. Process (apply) asset as per registered processor.
  - "Non-standard" flow examples:
    - Source handler does all the work and skips transformations and processing;
      especially relevant for public assets, which can be applied as "hypermedia".
    - Arguments instructs return of raw asset (asset text).
    - Path-specific asset injected, which ignores source handlers;
      useful for testing.
  */
  async get(specifier, ...args) {
    const options = { ...(args.find((a) => type(a) === "Object") || {}) };
    args = args.filter((a) => type(a) !== "Object");

    if (this.meta.DEV) {
      specifier = await this.redirects.redirect(specifier, options, ...args);
    }

    const path = Path.create(specifier);
    let result;
    /* Import */
    if (this.#_.added.has(path.full)) {
      /* Added assets */
      result = this.#_.added.get(path.full);
      if (typeof result === "function") {
        result = await result({ path });
      }
    } else {
      /* Get assets from registered source (nothing from added) */
      if (!this.sources.has(path.source)) {
        UseError.raise(`Invalid source: ${path.source}`);
      }
      const { timeout } = options;
      if (timeout) {
        const { promise, resolve, reject } = Promise.withResolvers();
        const timer = setTimeout(() => {
          const error = new UseError(
            `Importing '${path.full}' took longer than ${timeout}ms.`
          );
          this.meta.DEV ? reject(error) : resolve(error);
        }, timeout);
        this.sources
          .get(path.source)(
            { options: { ...options }, owner: this, path },
            ...args
          )
          .then((result) => {
            clearTimeout(timer);
            resolve(result);
          });
        result = await promise;
      } else {
        result = await this.sources.get(path.source)(
          { options: { ...options }, owner: this, path },
          ...args
        );
      }
    }
    /* Escape */
    if (path.detail.escape) return result;
    /* Error */
    if (result instanceof Error) return result;
    /* Raw */
    if (options.raw) return result;
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

/** Register out-of-the-box redirects. */

/* Redirects @/-sheets to / counter parts.
Ensures live sheet updates during DEV and fast sheet loads in PROD. */
use.redirects.add((specifier, options, ...args) => {
  if (
    options.auto &&
    specifier.startsWith("@/") &&
    specifier.endsWith(".css")
  ) {
    options.as = "sheet";
    return `/assets${specifier.slice(1)}`;
  }
});

/** Register out-of-the-box sources. */

/* Register public assets as source (/). 
NOTE
- Use for:
  - Add-hoc added global sheets ("hypermedia").
  - Libs that do not expose npm packages/ESM ("hypermedia").
  - Large-volume small-size content and data assets.
  - Other small-size assets that do not require minification
    and super-fast loading.
- Raw js not supported. Use '@/'-imports instead.
*/
use.sources.add(
  "/",
  (() => {
    const cache = new Map();
    const fetching = new Map();
    const _ = {
      /* Rebuild native 'import' to prevent Vite from barking */
      import: Function("u", "return import(u)"),
    };
    return async ({ options, owner, path }) => {
      const { as, raw } = options;
      /* Global sheet by link (FOUC-free) */
      if (path.type === "css" && as === undefined && raw !== true) {
        /* NOTE 'error' event does not fire reliably, therefore attempt raw 
        import, which will throw for invalid paths; it carries a small perf
        penalty, so only do in DEV. */
        if (use.meta.DEV) {
          await use(path.path, { raw: true });
        }
        const href = `${owner.meta.base}${path.path}`;
        let link = document.head.querySelector(
          `link[rel="stylesheet"][href="${href}"]`
        );
        if (link) return link;
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        const { promise, resolve } = Promise.withResolvers();
        link.addEventListener(
          "load",
          (event) => {
            resolve(link);
          },
          { once: true }
        );
        document.head.append(link);
        return await promise;
      }
      if (path.type === "js" && raw !== true) {
        /* Old-school script */
        if (as === "script") {
          const src = `${owner.meta.base}${path.path}`;
          let script = document.head.querySelector(`script[src="${src}"]`);
          if (script) return true;
          script = document.createElement("script");
          script.src = src;
          const { promise, resolve } = Promise.withResolvers();
          script.addEventListener("load", (event) => resolve(true), {
            once: true,
          });
          document.head.append(script);
          return await promise;
        }
        /* Module */
        if (as === undefined) {
          return await _.import(`${owner.meta.base}${path.path}`);
        }
      }
      /* Text-based asset */
      if (cache.has(path.full)) {
        //console.log(`Using cached version of: ${path.full}`); ////
        return cache.get(path.full);
      }
      if (fetching.has(path.full)) {
        //console.log(`Awaiting fetch of: ${path.full}`); ////
        const promise = fetching.get(path.full);
        const result = await promise;
        fetching.delete(path.full);
        return result;
      } else {
        //console.log(`Fetching: ${path.full}`); ////
        const { promise, resolve } = Promise.withResolvers();
        fetching.set(path.full, promise);
        const result = (
          await (
            await fetch(`${owner.meta.base}${path.path}`, { cache: "no-store" })
          ).text()
        ).trim();
        /* Alternative fetch: */
        async () =>
          await fetch(`${owner.meta.base}${path.path}?d=${Date.now()}`);
        /* Invalid paths causes result to be index.html (with misc devtools 
        injected). Use custom index meta as indicator for invalid path, 
        since such an element should not be present in imported assets. */
        const tester = document.createElement("div");
        tester.innerHTML = result;
        if (tester.querySelector(`meta[index]`)) {
          /* NOTE Critical to remove from fetching on error! */
          fetching.delete(path.full);
          UseError.raise(`Invalid path: ${path.full}`);
        }
        cache.set(path.full, result);
        resolve(result);
        fetching.delete(path.full);
        return result;
      }
    };
  })()
);

/* Register asset carrier sheet as source (@/).
NOTE 
- Tightly coupled with build tools and parcels.
- Always returns raw asset, subject to any subsequent transformation and 
  processing.
- Use for:
  - External libs.
  - Text-based assets that need fast retrival. 
- Attractive because:
  - Does not hit bundle size.
  - Low latency.
  - Serialized out-of-the-box
*/
if (!document.head.querySelector(`link[href="/assets.css"]`)) {
  ////console.log(`Injecting asset-carrier sheet.`); ////
  await use(`/assets.css`);
}

(() => {
  const cache = new Map();
  use.sources.add("@", ({ path }) => {
    //console.log("path.full:", path.full);////
    if (cache.has(path.full)) {
      //console.log("Using cached result for:", path.full);////
      return cache.get(path.full);
    }
    //console.log("Creating result for:", path.full);////
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
  //console.log("@ source created"); ////
})();

/** Register out-of-the-box transformers and processors for native types. */

/* Add css support.
- Transform: Text -> Sheet instance.
- Process: Adoption of Sheet instance.
*/
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

/* Add js support.
- Base case: Text -> module.
- With `{as: 'function'}` option: Text -> iife. 
  Can sometimes be a cleaner alternative to the `{as: 'script'}` option
  and can be used for '@/' imports. 
*/
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
      //console.log("key:", key);////
      if (cache.has(key)) {
        //console.log("Using cached result for:", key); ////
        return cache.get(key);
      }
      if (constructing.has(key)) {
        //console.log(`Awaiting construction of: ${key}`); ////
        const promise = constructing.get(key);
        const result = await promise;
        constructing.delete(key);
        return result;
      } else {
        const { promise, resolve } = Promise.withResolvers();
        constructing.set(key, promise);
        //console.log("Creating result for:", key); ////
        if (as === "function") {
          /* NOTE When dealing with self-hosted external libs that are not 
          available as ESM, import as 'function' can sometimes be a cleaner 
          alternative to importing as 'script'. */
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
        constructing.delete(key);
        cache.set(key, result);
        return result;
      }
    };
  })()
);

/* Add json support.
- Text -> JS object.
- Does not cache to avoid mutation issues. 
*/
use.types.add("json", (result) => {
  /* Type guard */
  if (!(typeof result === "string")) return;
  return JSON.parse(result);
});

window.dispatchEvent(new CustomEvent("_use"));
