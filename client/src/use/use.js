/* Import engine.

TODO
- Synthetic types, e.g., .component.html
*/

/* Import tools for the import engine. */
import { Exception } from "./_tools/exception.js";
import { Module } from "./_tools/module.js";
import { Path } from "./_tools/path.js";
import { Registry } from "./_tools/registry.js";

const assets = new (class Assets {
  #_ = {
    added: new Map(),
    detail: {},
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
  - manually making objects use-importable (do this only sparringly)
  - overloading asset when testing parcels. */
  add(key, value) {
    if (typeof key === "string") {
      this.#_.added.set(key, value);
    } else {
      /* key assumed to be a plain object */
      for (const [k, v] of Object.entries(key)) {
        this.#_.added.set(k, v);
      }
    }
    return this;
  }

  /* Returns asset. */
  async get(path, ...args) {
    const options = { ...(args.find((a) => typeName(a) === "Object") || {}) };
    args = args.filter((a) => typeName(a) !== "Object");

    /* Added assets */
    if (this.#_.added.has(path)) {
      return this.#_.added.get(path);
    }

    path = Path.create(path);

    /* Assets text from registered source */
    if (!this.sources.has(path.source)) {
      throw new Error(`Invalid source: ${path.source}`);
    }
    let result = await this.sources.get(path.source)(
      { options: { ...options }, owner: this, path },
      ...args
    );

    if (path.detail.escape) return result;

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
    /* Use asset unless source or type handler instructs not to do so 
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

/* Make selected import engine tools available via import engine. 
NOTE Good practice to indicate injection by not using a source prefix.
Also mitigates collisions. */
assets.add({
  Exception,
  Module,
  Path,
  Registry,
});

/* Add public as source */
assets.sources.add(
  "/",
  (() => {
    const cache = new Map();
    return async ({ options, owner, path }, ...args) => {
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
          return await Module.import(`${owner.meta.base}${path.path}`);
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
      //console.log('result:', result)////
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

/* Add asset sheet as source 
NOTE No strong case for providing option to add sheet via link, 
since global main sheet is created by build tools. */
assets.sources.add(
  "@",
  (() => {
    const cache = new Map();
    const link = document.head.querySelector(`link[assets]`);
    return async ({ options, owner, path }, ...args) => {
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

/* Add assets as source.
NOTE Only if run in Vite environment so that module can be imported in
external non-Vite code (albeit without assets import of course). */
if (
  typeof import.meta !== "undefined" &&
  typeof import.meta.env !== "undefined" &&
  import.meta.env.MODE
) {
  const START = "../assets".length;

  const loaders = Object.freeze(
    Object.fromEntries(
      Object.entries({
        ...import.meta.glob("../assets/**/*.css", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("../assets/**/*.html", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("../assets/**/*.js"),
        ...import.meta.glob("../assets/**/*.json", {
          import: "default",
          query: "?raw",
        }),
        ...import.meta.glob("../assets/**/*.jsx"),
      }).map(([k, v]) => [k.slice(START), v])
    )
  );

  assets.sources.add("@@", async ({ options, owner, path }, ...args) => {
    Exception.if(!(path.path in loaders), `Invalid path:${path.full}`);
    if (path.type === "js") {
      /* Escape transformation and processing */
      Object.assign(path.detail, { transform: false, process: false });
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
    Exception.if(
      typeName(result) !== "CSSStyleSheet",
      `Result is not a CSSStyleSheet`,
      () => console.error("Result:", result)
    );
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

/* Add js type handler to transform JS text to module or to execute iife. */
assets.types.add(
  "js",
  (() => {
    const cache = new Map();
    return async (text, { options, owner, path }, ...args) => {
      let result;
      const { as } = options;

     
      const key = as === "function" ?  `${path.full}?${as}` : path.full;


      if (cache.has(key)) return cache.get(key);


      if (as === "function") {
         result = Function(`return ${text}`)();
         if (result === undefined) {
          /* Since undefined results are ignored, convert to null */
          result = null;
        }


       


      }  else {
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

function typeName(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export {};
