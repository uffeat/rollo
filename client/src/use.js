/* v.20251221 */
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

/* Tool for specifier manipulation in DEV */
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

        this.#_.env = this.#_.DEV ? "development" : "production";
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

      get detail() {
        return this.#_.detail;
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
  - manually making objects use-importable (only do when  really necessary)
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
      new Blob([text], { type: "text/javascript" })
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
      /* Redirect */
      specifier = this.redirects.redirect(specifier, options, ...args);
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
})();

/** Register out-of-the-box redirects to ensures live loads during DEV and fast loads in PROD.*/

// Converts `@/**/*.css` to `/parcels/**/*.css` specifiers and sets 'as' option to 'sheet' (to avoid load by link).
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

// Converts `@/**/*.*` to `/parcels/**/*.*` specifiers for `.html`, `.json`, and `.template` types.
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
    const loading = new Map();
    const _ = {
      /* Rebuild native 'import' to prevent Vite from barking.
      Yeah, yeah, a little unDRY (also in 'assets'), but keeps things clean. */
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
        if (link) {
          if (loading.has(href)) return loading.get(href);
          return link;
        }
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        const { promise, resolve, reject } = Promise.withResolvers();
        loading.set(href, promise);
        link.addEventListener(
          "load",
          (event) => {
            resolve(link);
            loading.delete(href);
          },
          { once: true }
        );
        link.addEventListener(
          "error",
          (event) => {
            loading.delete(href);
            reject(new UseError(`Failed to load sheet: ${href}`));
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
          if (script) {
            if (loading.has(src)) return loading.get(src);
            return true;
          }
          script = document.createElement("script");
          script.src = src;
          const { promise, resolve, reject } = Promise.withResolvers();
          loading.set(src, promise);
          script.addEventListener(
            "load",
            (event) => {
              loading.delete(src);
              resolve(true);
            },
            { once: true }
          );
          script.addEventListener(
            "error",
            (event) => {
              loading.delete(src);
              reject(new UseError(`Failed to load script: ${src}`));
            },
            { once: true }
          );
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
        return cache.get(path.full);
      }
      if (fetching.has(path.full)) {
        const promise = fetching.get(path.full);
        const result = await promise;
        fetching.delete(path.full);
        return result;
      } else {
        const { promise, resolve, reject } = Promise.withResolvers();
        fetching.set(path.full, promise);
        try {
          const result = (
            await (
              await fetch(`${owner.meta.base}${path.path}`, {
                cache: "no-store",
              })
            ).text()
          ).trim();
          /* Alternative fetch: */
          //async () => await fetch(`${owner.meta.base}${path.path}?d=${Date.now()}`);
          /* Invalid paths causes result to be index.html (with misc devtools 
          injected). Use custom index meta as indicator for invalid path, 
          since such an element should not be present in imported assets. */
          const tester = document.createElement("div");
          tester.innerHTML = result;
          if (tester.querySelector(`meta[index]`)) {
            UseError.raise(`Invalid path: ${path.full}`);
          }
          cache.set(path.full, result);
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        } finally {
          fetching.delete(path.full);
        }
      }
    };
  })()
);

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

/* Add json support.
- Text -> JS object.
- Does not cache to avoid mutation issues. 
*/
use.types.add("json", (result) => {
  /* Type guard */
  if (!(typeof result === "string")) return;
  return JSON.parse(result);
});

/** Register out-of-the-box transformers and processors for common non-native assets. */

/* Add supprt for runtime MD parsing, incl. Frontmatter-style.
NOTE Caches by default, but possible to opt out. */
use.types.add(
  "md",
  (() => {
    const cache = new Map();
    return async (text, { options, owner, path }) => {
      /* Options guard guard */
      if (options.raw) return;
      if (options.cache !== false && cache.has(path.full)) {
        return cache.get(path.full);
      }
      /* Type guard */
      if (!(typeof text === "string")) return;
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
    };
  })()
);

/** Register out-of-the-box transformers and processors for synthetic assets. */

/* Add x.html/x.template support.
NOTE Use the html-associated file type 'template' for html public assets 
to avoid Vercel-injections.
*/
(() => {
  const cache = new Map();
  use.processors.add("x.html", "x.template", async (result, { path }) => {
    /* Type guard */
    if (!(typeof result === "string")) return;
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
        return v instanceof HTMLElement;
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
