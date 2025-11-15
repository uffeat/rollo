/* Import engine. */

/* Base for composed registries */
class Registry {
  #_ = {
    registry: new Map(),
  };

  constructor(owner) {
    this.#_.owner = owner;
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
}

const assets = new (class Assets {
  #_ = {
    added: new Map(),
    //cache: new Map(),
    detail: {},
    /* Rebuild native 'import' to prevent Vite from barking */
    import: Function("u", "return import(u)"),
  };

  constructor() {
    const assets = this;
    /* Create meta */
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
      }

      get DEV() {
        return this.#_.DEV;
      }

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
    /* Create sources controller */
    this.#_.sources = new (class Sources extends Registry {
      constructor(owner) {
        super(owner);
      }
    })(this);
    /* Create processors controller */
    this.#_.processors = new (class Processors extends Registry {
      constructor(owner) {
        super(owner);
      }
    })(this);
    /* Create types controller */
    this.#_.types = new (class Types extends Registry {
      constructor(owner) {
        super(owner);
      }
    })(this);
    /* Repackage 'assets' to global 'use' callable */
    Object.defineProperty(globalThis, "use", {
      configurable: false,
      enumerable: true,
      writable: false,
      value: new Proxy(async () => {}, {
        get(target, key) {
          if (key === "assets") return assets;
          return assets[key];
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

  /* Returns meta data. */
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
  - manually making objects use-importable (avoid)
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

  /* Returns public module. 
  NOTE Provided to enable dog-fooding. */
  async import(path) {
    //if (this.#_.cache.has(path)) return this.#_.cache.get(path);
    const result = await this.#_.import(`${this.meta.base}${path}`);
    //this.#_.cache.set(path, result);
    return result;
  }

  /* Returns asset. */
  async get(path, ...args) {
    const { Exception } = await this.import("/tools/exception.js");
    const { Path } = await this.import("/tools/path.js");
    const { type } = await this.import("/tools/type.js");
    const options = { ...(args.find((a) => type(a) === "Object") || {}) };
    args = args.filter((a) => type(a) !== "Object");
    let result;
    /* Added assets */
    if (this.#_.added.has(path)) {
      result = this.#_.added.get(path);
      if (typeof result !== "string") {
        return result;
      }
      /* Added asset is raw - subject to transformation and processing */
    }
    path = Path.create(path);
    /* Get assets from registered source (if nothing from added) */
    if (result === undefined) {
      if (!this.sources.has(path.source)) {
        throw new Error(`Invalid source: ${path.source}`);
      }
      result = await this.sources.get(path.source)(
        { options: { ...options }, owner: this, path },
        ...args
      );

      if (path.detail.escape) return result;
    }

    /* Raw */
    const { raw = false } = options;
    if (raw) return result;
    /* Create asset from text, unless source handler instructs not to do 
    so via mutation of path.detail. */
    if (path.detail.transform !== false && this.types.has(path.type)) {
      const transformer = this.types.get(path.type);
      const asset = await transformer(
        result,
        { options: { ...options }, owner: this, path },
        ...args
      );
      /* Ignore undefined type handler result. */
      if (asset !== undefined) {
        result = asset;
      }
    }

    /* Process asset unless source or type handler instructs not to do so 
    via mutation of path.detail. */
    if (path.detail.process !== false && this.processors.has(path.types)) {
      const processor = this.processors.get(path.types);
      const processed = await processor(
        result,
        { options: { ...options }, owner: this, path },
        ...args
      );
      /* Ignore undefined processor result. */
      if (processed !== undefined) {
        result = processed;
      }
    }
    return result;
  }
})();

/* Add public as source (/). */
assets.sources.add(
  "/",
  (() => {
    const cache = new Map();
    return async ({ options, owner, path }, ...args) => {
      const { Exception } = await owner.import("/tools/exception.js");
      const { component } = await use("@/component.js");
      const { as, raw } = options;
      if (path.type === "css" && as === "link") {
        /* Escape transformation and processing */
        Object.assign(path.detail, { escape: true });
        const href = `${owner.meta.base}${path.path}`;
        let link = document.head.querySelector(
          `link[rel="stylesheet"][href="${href}"]`
        );
        if (link) return link;
        link = component.link({ rel: "stylesheet", href });
        const { promise, resolve } = Promise.withResolvers();
        link.on.load$once = (event) => resolve(link);
        document.head.append(link);
        return await promise;
      }
      if (path.type === "js" && raw !== true) {
        if (as === "script") {
          /* Escape transformation and processing */
          Object.assign(path.detail, { escape: true });
          const src = `${owner.meta.base}${path.path}`;
          let script = document.head.querySelector(`script[src="${src}"]`);
          if (script) return script;
          script = component.script({ src });
          const { promise, resolve } = Promise.withResolvers();
          script.on.load$once = (event) => resolve();
          document.head.append(script);
          return await promise;
        }
        if (as !== "function") {
          /* Escape transformation and processing */
          Object.assign(path.detail, { escape: true });
          return await owner.import(path.path);
        }
      }
      /* Asset text import */
      const key = path.full;
      if (cache.has(key)) return cache.get(key);
      const result = (
        await (
          await fetch(`${owner.meta.base}${path.path}`, { cache: "no-store" })
        )
          /* Alternatively:
          await fetch(`${owner.meta.base}${path.path}?d=${Date.now()}`)
          */
          .text()
      ).trim();
      /* Invalid paths causes result to be index.html (with misc devtools injected). 
      Use custom index meta as indicator for invalid path, since such an element should not be present in imported assets.  */
      const temp = component.div({ innerHTML: result });
      Exception.if(
        temp.querySelector(`meta[index]`),
        `Invalid path: ${path.path}`
      );
      cache.set(key, result);
      return result;
    };
  })()
);

/* Add assets (via carrier-sheet) as source (@/).
NOTE No strong case for providing option to add sheet via link, 
since global main sheet is created by build tools. */
assets.sources.add(
  "@",
  (() => {
    const cache = new Map();
    const link = document.head.querySelector(`link[assets]`);
    return async ({ options, owner, path }, ...args) => {
      const { Exception } = await owner.import("/tools/exception.js");
      const key = path.full;
      if (cache.has(key)) return cache.get(key);
      link.setAttribute("__path__", path.path);
      const propertyValue = getComputedStyle(link)
        .getPropertyValue("--__asset__")
        .trim();
      link.removeAttribute("__path__");
      ////console.log('propertyValue:', propertyValue)////
      Exception.if(!propertyValue, `Invalid path: ${key}`);
      const result = atob(propertyValue.slice(1, -1));
      cache.set(key, result);
      return result;
    };
  })()
);

/* Add src/assets as source (@@/).
NOTE Only if run in Vite environment so that module can be imported in
external non-Vite code (albeit without assets import of course). */
if (
  typeof import.meta !== "undefined" &&
  typeof import.meta.env !== "undefined" &&
  import.meta.env.MODE
) {
  const START = "./assets".length;
  const loaders = Object.freeze(
    Object.fromEntries(
      Object.entries({
        ...import.meta.glob("./assets/**/*.css", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("./assets/**/*.html", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("./assets/**/*.js"),
        ...import.meta.glob("./assets/**/*.json", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("./assets/**/*.jsx"),
        ...import.meta.glob("./assets/**/*.template", {
          import: "default",
          query: "?raw",
        }),
      }).map(([k, v]) => [k.slice(START), v])
    )
  );

  /* NOTE Currently, raw is not supported for js (and js-like) src/assets (@@/) imports. 
  Could be done via manipulation of loaders keys, but is probably not worth it. */
  assets.sources.add("@@", async ({ options, owner, path }, ...args) => {
    const { Exception } = await owner.get("@/tools/exception.js");
    Exception.if(!(path.path in loaders), `Invalid path:${path.full}`);
    if (path.type === "js") {
      /* Escape transformation and processing */
      Object.assign(path.detail, { escape: true });
    }
    const load = loaders[path.path];
    const result = await load();
    return result;
  });
}

/* Add css type handler to transform CSS text to Sheet instance and css 
processor to use Sheet instance. */
assets.types
  .add(
    "css",
    (() => {
      const cache = new Map();
      return async (text, { options, owner, path }, ...args) => {
        const { Sheet } = await owner.get("@/sheet.js");
        const key = path.full;
        if (cache.has(key)) return cache.get(key);
        const result = Sheet.create(text, key);
        cache.set(key, result);
        return result;
      };
    })()
  )
  .processors.add("css", async (result, { options, owner, path }, ...args) => {
    const { type } = await owner.get("@/tools/type.js");
    const { Exception } = await owner.get("@/tools/exception.js");
    Exception.if(
      type(result) !== "CSSStyleSheet",
      `Result is not a CSSStyleSheet`,
      () => console.error("Result:", result)
    );
    const targets = args.filter(
      (a) =>
        type(a) === "HTMLDocument" || a instanceof ShadowRoot || a.shadowRoot
    );
    if (targets.length) {
      /* NOTE sheet.use() adopts to document, therefore check targets' length */
      result.use(...targets);
    }
  });

/* Add js type handler to transform JS text to module or to execute iife. */
assets.types.add(
  "js",
  (() => {
    const cache = new Map();
    return async (text, { options, owner, path }, ...args) => {
      const { Module } = await owner.import("/tools/module.js");
      let result;
      const { as } = options;
      const key = as === "function" ? `${path.full}?${as}` : path.full;
      if (cache.has(key)) return cache.get(key);
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
        result = await Module.create(text, path.path);
      }
      cache.set(key, result);
      return result;
    };
  })()
);

/* Add json type handler to transform JSON text to JS object.
NOTE Does not cache to avoid mutation issues. */
assets.types.add("json", (result, { options, owner, path }, ...args) => {
  return JSON.parse(result);
});

/* Add x.html/x.template to transform html to synthetic asset-aware asset.
NOTE Use the html-associated file type 'template' for html public assets 
to avoid Vercel-injections.*/
(() => {
  const cache = new Map();
  const handler = async (result, { options, owner, path }, ...args) => {
    const { Module } = await owner.get("@/tools/module.js");

    const key = path.full;
    if (cache.has(key)) return cache.get(key);
    const { extract } = await use("@/tools/html.js");
    const { assets, js } = extract(result);
    result = assets;
    if (js) {
      result =
        (await (
          await Module.create(js, path.path)
        )?.default?.call(assets, { path })) ?? assets;
    }
    cache.set(key, result);
    return result;
  };
  use.assets.processors.add("x.html", handler);
  use.assets.processors.add("x.template", handler);
})();

export {};
