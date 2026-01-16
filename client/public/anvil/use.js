const typeName = (value) => Object.prototype.toString.call(value).slice(8, -1);

const is = new (class {
  element(value) {
    return value instanceof HTMLElement;
  }

  function(value) {
    return typeof value === "function";
  }

  object(value) {
    return typeName(value) === "Object";
  }

  string(value) {
    return typeName(value) === "String";
  }
})();

/* Custom error for throwing import-engine specific errors. */
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
- Not intended for external construction, but exposed to enable testing. */
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

    /* Trailing '/' -> repeats last part with js type. */
    if (parts.at(-1) === "") {
      parts[parts.length - 1] = `${parts[parts.length - 2]}.js`;
    }
    /* '//' in path -> repeats next part without any types. */
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
    /* Build props */
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

/* Utility for specifier manipulation in DEV. */
class Redirects {
  #_ = {
    registry: new Set(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  add(redirector) {
    this.#_.registry.add(redirector);
    return this.#_.owner;
  }

  redirect(specifier, options, ...args) {
    for (const redirector of this.#_.registry.values()) {
      const result = redirector(specifier, options, ...args);
      if (result) {
        return result;
      }
    }
    return specifier;
  }
}

/* Caching utility with inflight management. */
export class Store {
  #_ = {
    /* Create combined cache/inflight map */
    registry: new Map(),
  };

  get __registry__() {
    return this.#_.registry;
  }

  /* Deletes item in registry by key. */
  clear(key) {
    this.#_.registry.delete(key);
  }

  /* Returns result. */
  async get(key) {
    if (this.#_.registry.has(key)) {
      const stored = this.#_.registry.get(key);
      if ("result" in stored) {
        return stored.result;
      }
      if ("promise" in stored) {
        const result = await stored.promise;
        delete stored.promise;
        stored.result = result;
        return result;
      }
    }
    return null;
  }

  /* Checks if key in registry. */
  has(key) {
    return this.#_.registry.has(key);
  }

  /* Checks if processing. */
  processing(key) {
    const stored = this.#_.registry.get(key) || {};
    return "promise" in stored;
  }

  /* Returns functions for storing result. */
  setup(key) {
    UseError.if(
      this.#_.registry.has(key),
      `'setup' already used for key: ${key}`
    );
    const pwr = Promise.withResolvers();
    /* Store plain mutable storage object to avoid tinkering with map */
    const stored = { promise: pwr.promise };
    this.#_.registry.set(key, stored);
    return {
      resolve: (result) => {
        stored.result = result;
        delete stored.promise;
        pwr.resolve(result);
        return result;
      },
      reject: (error) => {
        /* Wipe from registry */
        this.#_.registry.delete(key);
        pwr.reject(error);
        return error;
      },
    };
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
        this.#_.embedded = window !== window.parent;
        /* NOTE Port-aware base allows access to public when testing parcels. */
        this.#_.base = "";
        if (this.embedded) {
          this.#_.base = "https://rolloh.vercel.app";
        } else if (this.DEV && location.port !== PORT) {
          this.#_.base = `http://localhost:${PORT}`;
        }
        this.#_.VITE = import.meta && import.meta.env && import.meta.env.MODE;

        this.#_.env = this.#_.DEV ? "development" : "production";

        const owner = this;

        this.#_.companion = new (class {
          #_ = {};
          constructor() {
            if (owner.embedded) {
              this.#_.origin = window.parent.location.origin;
            } else {
              this.#_.origin = owner.DEV
                ? "https://rollohdev.anvil.app"
                : "https://rolloh.anvil.app";
            }
          }
          get origin() {
            return this.#_.origin;
          }
        })();
      }

      get DEV() {
        return this.#_.DEV;
      }

      /* Returns flag that indicates if running in Vite env. */
      get VITE() {
        return this.#_.VITE;
      }

      /* Returns prefix for access to public. */
      get base() {
        return this.#_.base;
      }

      set base(base) {
        this.#_.base = base;
      }

      get companion() {
        return this.#_.companion;
      }

      get detail() {
        return this.#_.detail;
      }

      get embedded() {
        return this.#_.embedded;
      }

      get env() {
        return this.#_.env;
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
          if (is.function(value)) {
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

  /* Returns processors controller. 
  NOTE Operates on 'path.types'. */
  get processors() {
    return this.#_.processors;
  }

  /* Returns redirects controller. 
  NOTE Only kicks in in DEV. Redirects are expensive and exist to enable 
  access to unbuilt assets during DEV. */
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
  - manually making objects use-importable (only do when really necessary)
  - overloading asset when testing parcels (knock yourself out!). */
  add(key, value) {
    if (is.string(value)) {
      this.#_.added.set(key, value);
    } else {
      /* key assumed to be a plain object or module */
      for (const [k, v] of Object.entries(key)) {
        this.add(k, v);
      }
    }
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

  /* Returns asset. */
  async get(specifier, ...args) {
    const options = { ...(args.find((a) => is.object(a)) || {}) };
    args = args.filter((a) => !is.object(a));
    if (this.meta.DEV) {
      /* Redirect */
      specifier = this.redirects.redirect(specifier, options, ...args);
    }
    const path = Path.create(specifier);
    let result;
    /* Import */
    if (this.#_.added.has(path.full)) {
      /* Added assets */
      result = this.#_.added.get(path.full);
      if (is.function(result)) {
        result = await result({ path });
      }
    } else {
      /* Get assets from registered source (nothing from added) */
      UseError.if(
        !this.sources.has(path.source),
        `Invalid source: ${path.source}`
      );
      result = await this.sources.get(path.source)(
        { options: { ...options }, owner: this, path },
        ...args
      );
    }
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

  /* Returns JS module from url without caching. */
  async import(u) {
    return this.#_.import(u);
  }

  /* Returns uncached constructed module.
  NOTE Provided as a service to handlers. */
  async module(text, path) {
    if (path) {
      text = `${text}\n//# sourceURL=${path}`;
    }
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/javascript" })
    );
    const result = await this.import(url);
    URL.revokeObjectURL(url);
    return result;
  }
})();

/** Register out-of-the-box redirects to ensures live loads during DEV 
and fast loads in PROD.*/

// Converts `@/**/*.css` to `/parcels/**/*.css` specifiers and sets 'as'
// option to 'sheet' (to avoid load by link).
use.redirects.add((specifier, options, ...args) => {
  if (
    options.auto &&
    specifier.startsWith("@/") &&
    specifier.endsWith(".css")
  ) {
    options.as = "sheet";
    return `/parcels${specifier.slice(1)}`;
  }
});

// Converts `@/**/*.*` to `/parcels/**/*.*` specifiers for `.html`, `.json`,
// and `.template` types.
use.redirects.add((specifier, options, ...args) => {
  if (
    options.auto &&
    specifier.startsWith("@/") &&
    (specifier.endsWith(".json") ||
      specifier.endsWith(".html") ||
      specifier.endsWith(".template"))
  ) {
    return `/parcels${specifier.slice(1)}`;
  }
});

/** Register out-of-the-box sources. */

/* Register public assets as source (/). 
NOTE
- Use for:
  - Dynamic link-based loading of sheets.
  - Large-volume small-size content and data assets.
  - Other small-size assets that do not require Vite processing
    and super-fast loading (typically, ad-hoc stuff to be baked into carrier 
    sheet later).
  - Self-hosted external libs intended that
    - require old-school script loading.
    - cannot be utf-8 serialized.
*/
(() => {
  const store = new Store();
  use.sources.add("/", async ({ options, owner, path }) => {
    const { as, raw } = options;
    /* Global sheet by link (FOUC-free) */
    if (path.type === "css" && !as && !raw) {
      /* NOTE 
      - Returns actual link, since link can be meaningfully removed.
      - 'error' event does not fire reliably, therefore attempt raw 
        import, which will throw for invalid paths; it carries a small perf
        penalty, so only do in DEV. */
      if (use.meta.DEV) {
        await use(path.path, { raw: true });
      }
      const href = `${owner.meta.base}${path.path}`;
      let link = document.head.querySelector(
        `link[rel="stylesheet"][href="${href}"]`
      );
      if (link) {
        /* link in DOM -> no need to keep on store */
        store.clear(href);
        return link;
      }
      if (store.has(href)) {
        link = await store.get(href);
        return link;
      }
      const { resolve, reject } = store.setup(href);
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.addEventListener("load", () => resolve(link), { once: true });
      link.onerror = () => reject(new UseError(`Failed to load: ${href}`));
      document.head.append(link);
      return link;
    }
    if (path.type === "js" && !raw) {
      /* Old-school script */
      if (as === "script") {
        const src = `${owner.meta.base}${path.path}`;
        let script = document.head.querySelector(`script[src="${src}"]`);
        if (script) {
          /* script in DOM -> no need to keep on store */
          store.clear(src);
          return true;
        }
        if (store.has(src)) {
          return true;
        }
        const { resolve, reject } = store.setup(src);
        script = document.createElement("script");
        script.src = src;
        script.addEventListener("load", () => resolve(true), { once: true });
        script.onerror = () => reject(new UseError(`Failed to load: ${src}`));
        document.head.append(script);
        return true;
      }
      /* Module */
      if (!as) {
        return await owner.import(`${owner.meta.base}${path.path}`);
      }
    }
    /* Text-based asset */
    if (store.has(path.full)) {
      return await store.get(path.full);
    } else {
      const { resolve, reject } = store.setup(path.full);
      try {
        const result = (
          await (
            await fetch(`${owner.meta.base}${path.path}`, {
              cache: "no-store",
            })
          ).text()
        ).trim();
        /* HACK Invalid paths resolve to index.html, which has a special meta; 
        regular assets do not. The test carries a small perf penalty, so only 
        do in DEV. */
        if (use.meta.DEV) {
          const tester = document.createElement("div");
          tester.innerHTML = result;
          UseError.if(
            tester.querySelector(`meta[index]`),
            `Invalid path: ${path.full}`
          );
        }
        return resolve(result);
      } catch (error) {
        throw reject(error);
      }
    }
  });
})();

/* Register asset carrier sheet as source (@/).
NOTE 
- Tightly coupled with build tools and parcels.
- Always returns raw asset, subject to any subsequent transformation and 
  processing.
- Attractive because:
  - Does not hit bundle size.
  - Low latency.
  - Serialized out-of-the-box
*/
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
        if (!is.string(text)) return;
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
    if (typeName(result) !== "CSSStyleSheet") return;
    const targets = args.filter(
      (a) =>
        typeName(a) === "HTMLDocument" ||
        a instanceof ShadowRoot ||
        a.shadowRoot
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
    /* Options guard */
    if (!options.convert) return;
    /* Type guard */
    if (!is.string(text)) return;
    const { component } = await use("@/rollo/");
    return component.from(text);
  }
);

/* Add js support.
- Base case: Text -> module.
- With `{as: 'function'}` option: Text -> iife. 
  Can sometimes be a cleaner alternative to the `{as: 'script'}` option
  and can be used for '@/' imports. 
*/
(() => {
  const store = new Store();
  use.types.add("js", async (text, { options, owner, path }) => {
    /* Type guard */
    if (!is.string(text)) return;
    let result;
    const { as } = options;
    const key = as === "function" ? `${path.full}?${as}` : path.full;
    if (store.has(key)) {
      return await store.get(key);
    }
    const { resolve, reject } = store.setup(key);
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
      return resolve(result);
    } catch (error) {
      throw reject(error);
    }
  });
})();

/* Add json support.
- Text -> JS object.
- Does not cache to avoid mutation issues. 
*/
use.types.add("json", (text) => {
  /* Type guard */
  if (!is.string(text)) return;
  return JSON.parse(text);
});

/** Register out-of-the-box transformers and processors for common non-native assets. */

/* Add supprt for runtime MD parsing, incl. Frontmatter-style.
NOTE Caches by default, but possible to opt out. */
(() => {
  const cache = new Map();
  use.types.add("md", async (text, { options, owner, path }) => {
    /* Options guard guard */
    if (options.raw) return;
    if (options.cache !== false && cache.has(path.full)) {
      return cache.get(path.full);
    }
    /* Type guard */
    if (!is.string(text)) return;
    const { marked } = await use("@/marked");
    let result;
    if (text.startsWith("---")) {
      /* Frontmatter style */
      const { YAML } = await use("@/yaml");
      const [yaml, md] = text.split("---").slice(1);
      const meta = Object.freeze(YAML.parse(yaml));
      const html = marked.parse(md);
      result = Object.freeze({ meta, html });
    } else {
      /* Pure MD */
      result = marked.parse(text);
    }
    if (options.cache !== false) {
      cache.set(path.full, result);
    }
    return result;
  });
})();

/** Register out-of-the-box transformers and processors for synthetic assets. */

/* Add x.html/x.template support.
NOTE Use the html-associated file type 'template' for html public assets 
to avoid Vercel-injections and Anvil asset registration.
*/
(() => {
  const cache = new Map();
  use.processors.add("x.html", "x.template", async (result, { path }) => {
    /* Type guard */
    if (!is.string(text)) return;
    const { component, Sheet } = await use("@/rollo/");
    if (cache.has(path.full)) return cache.get(path.full);
    const fragment = component.div({ innerHTML: result });
    const mod = await use.module(
      `export const __path__ = "${path.path}";${fragment
        .querySelector("script")
        .textContent.trim()}`,
      path.path
    );
    /* Get exposed components */
    const components = Object.fromEntries(
      Object.entries(mod).filter(([k, v]) => {
        return is.element(v);
      })
    );
    /* Prepare context */
    const assets = {};
    /* Parse styles */
    for (const element of fragment.querySelectorAll(`style`)) {
      /* Construct and adopt sheet scoped to exposed component */
      if (element.hasAttribute("for")) {
        const target = element.getAttribute("for");
        const sheet = Sheet.create(
          `[uid="${components[target].uid}"] { ${element.textContent.trim()} }`
        );
        if (element.hasAttribute("global")) {
          sheet.use();
        }
        if (element.hasAttribute("name")) {
          assets[element.getAttribute("name")] = sheet;
        }
        continue;
      }
      /* Construct and adopt global sheet and if named add to context */
      if (element.hasAttribute("global")) {
        const sheet = Sheet.create(element.textContent.trim()).use();
        if (element.hasAttribute("name")) {
          assets[element.getAttribute("name")] = sheet;
        }
      } else {
        /* Construct named sheet and add to context */
        assets[
          element.hasAttribute("name")
            ? element.getAttribute("name")
            : "__sheet__"
        ] = Sheet.create(element.textContent.trim());
      }
    }
    /* Parse templates */
    for (const element of fragment.querySelectorAll(`template`)) {
      assets[
        element.hasAttribute("name")
          ? element.getAttribute("name")
          : "__template__"
      ] = element.innerHTML.trim();
    }
    Object.freeze(assets);
    /* Build pseudo module */
    const pseudo = { __type__: "Module", assets };
    for (const [key, value] of Object.entries(mod)) {
      if (typeof value === "function") {
        if (key === "setup") {
          /* Do not include any 'setup' function member, but call 
          immediately with context. 
          NOTE Useful for one-off setup that requires context awareness. */
          await value.call(assets, assets);
          continue;
        }
        /* Bind function members to context */
        pseudo[key] = value.bind(assets);
        continue;
      }
      pseudo[key] = value;
    }
    cache.set(path.full, Object.freeze(pseudo));
    return pseudo;
  });
})();

window.dispatchEvent(new CustomEvent("_use"));

/* NOTE Really no need to export 'use' (since global),
but can help to silence linters in some cases. */
const _use = use;
export { _use as default };
