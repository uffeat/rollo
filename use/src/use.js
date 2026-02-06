import { Path, Registry, UseError, meta, typeName } from "./tools";

/* Import engine. 
- Provides dynamic imports.
- Supports a range of asset types from different sources out-of-the-box.
- Can be extended with respect to sources, types and processors.
*/
const assets = new (class Assets {
  #_ = {
    added: new Map(),
    detail: {},
    /* Rebuild native 'import' to prevent Vite from barking */
    import: Function("u", "return import(u)"),
  };

  constructor() {
    /* Compose meta */
    this.#_.meta = meta;
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
  }

  /* TODO Use or kill. */
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
    //console.log(`Adding ${key}:`, value); ////
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
        ...args,
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

  /* Native import */
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
      new Blob([text], { type: "text/javascript" }),
    );
    const result = await this.import(url);
    URL.revokeObjectURL(url);
    return result;
  }
})();

/* Repackage 'assets' to 'use' callable */
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

/* Make 'use' global 
NOTE In DEV (only), global 'use' can be changed. */
Object.defineProperty(globalThis, "use", {
  configurable: assets.meta.DEV,
  enumerable: true,
  writable: assets.meta.DEV,
  value: use,
});


/* Add css support.
- Transform: Text -> Sheet instance.
- Process: Adoption of Sheet instance.
*/
use.types.add(
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
  })(),
);

use.processors.add("css", async (result, options, ...args) => {
  /* Type guard */
  if (typeName(result) !== "CSSStyleSheet") return;
  const targets = args.filter(
    (a) =>
      typeName(a) === "HTMLDocument" || a instanceof ShadowRoot || a.shadowRoot,
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
    if (!(typeof text === "string")) return;
    const { component } = await use("@/rollo/");
    return component.from(text);
  },
);

/* Add js support.
- Base case: Text -> module.
- With `{as: 'function'}` option: Text -> iife. 
  Can sometimes be a cleaner alternative to the `{as: 'script'}` option
  and can be used for '@/' imports. 
*/
(() => {
  const cache = new Map();
  const processing = new Map();
  use.types.add("js", async (text, { options, owner, path }) => {
    /* Type guard */
    if (!(typeof text === "string")) return;
    let result;
    const { as } = options;
    const key = as === "function" ? `${path.full}?${as}` : path.full;
    if (cache.has(key)) {
      return cache.get(key);
    }
    if (processing.has(key)) {
      const promise = processing.get(key);
      const result = await promise;
      processing.delete(key);
      return result;
    } else {
      const { promise, resolve, reject } = Promise.withResolvers();
      processing.set(key, promise);
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
        processing.delete(key);
      }
    }
  });
})();

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

/* Add support for runtime MD parsing, incl. Frontmatter-style.
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
    if (!(typeof result === "string")) return;
    const { component, Sheet } = await use("@/rollo/");
    if (cache.has(path.full)) return cache.get(path.full);
    const fragment = component.div({ innerHTML: result });
    const mod = await use.module(
      `export const __path__ = "${path.path}";${fragment
        .querySelector("script")
        .textContent.trim()}`,
      path.path,
    );
    /* Get exposed components */
    const components = Object.fromEntries(
      Object.entries(mod).filter(([k, v]) => {
        return v instanceof HTMLElement;
      }),
    );
    /* Prepare context */
    const assets = {};
    /* Parse styles */
    for (const element of fragment.querySelectorAll(`style`)) {
      /* Construct and adopt sheet scoped to exposed component */
      if (element.hasAttribute("for")) {
        const target = element.getAttribute("for");
        const sheet = Sheet.create(
          `[uid="${components[target].uid}"] { ${element.textContent.trim()} }`,
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
but can help to silence linters. */
export { assets, use };
