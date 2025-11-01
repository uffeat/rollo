/* Import engine.

TODO
- 'assets' source. Import by glob
- Synthetic types, e.g., .component.html

*/

/* Import tools for the import engine. */
import { Exception } from "./exception.js";
import { Meta } from "./meta.js";
import { Module } from "./module.js";
import { Path } from "./path.js";
import { Registry } from "./registry.js";
import { define } from "./define.js";

class Assets {
  static create = (...args) => new Assets(...args);
  #_ = {
    added: new Map(),
    detail: {},
  };

  constructor() {
    document.head.append(this);
    /* Create meta */
    this.#_.meta = Meta.create(this);
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

  /* Injects vitual asset. */
  add(path, asset) {
    this.#_.added.set(path, asset);
    return this;
  }

  async get(path, ...args) {
    const options = args.find((a) => typeName(a) === "Object") || {};
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

    const { raw = false } = options;
    if (raw) {
      return result;
    }

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
}

const assets = Assets.create();

/* Make selected import engine tools available via import engine. 
NOTE Good practice to indicate injection by not using a source prefix.
Also mitigates collisions. */
assets.add("exception.js", Exception);
assets.add("module.js", Module);
assets.add("path.js", Path);
assets.add("registry.js", Registry);
assets.add("define.js", define);

/* Add public as source */
assets.sources.add(
  "/",
  (() => {
    const cache = new Map();
    return async ({ options, owner, path }, ...args) => {
      const { component } = await use("@/component.js");

      const { as } = options;
      if (path.type === "css" && as === "link") {
        /* Escape transformation and processing */
        Object.assign(path.detail, { transform: false, process: false });
        let link = document.head.querySelector(
          `link[rel="stylesheet"][href="${path.path}"]`
        );
        if (link) return link;
        link = component.link({ rel: "stylesheet", href: path.path });
        const { promise, resolve } = Promise.withResolvers();
        link.on.load$once = (event) => resolve(link);
        document.head.append(link);
        return await promise;
      }
      if (path.type === "js" && as === "script") {
        /* Escape transformation and processing */
        Object.assign(path.detail, { transform: false, process: false });
        let script = document.head.querySelector(`script[src="${path.path}"]`);
        if (script) return script;
        script = component.script({ src: path.path });
        const { promise, resolve } = Promise.withResolvers();
        script.on.load$once = (event) => resolve();
        document.head.append(script);
        return await promise;
      }
      /* Asset text import */
      if (cache.has(path.path)) return cache.get(path.path);
      const result = (await (await fetch(path.path)).text()).trim();
      /* Invalid paths causes result to be index.html (with misc devtools injected). 
      Use custom index meta as indicator for invalid path, since such an element should not be present in imported assets.  */
      //console.log('result:', result)////
      const temp = component.div({ innerHTML: result });
      if (temp.querySelector(`meta[index]`))
        Exception.raise(`Invalid path: ${path.path}`);
      cache.set(path.path, result);
      return result;
    };
  })()
);

/* Add carrier-sheet as source 
NOTE No strong case for providing the option to add sheet via link, 
since global main sheet is created by build tools. */
assets.sources.add(
  "@",
  (() => {
    const cache = new Map();
    const link = document.head.querySelector(`link[assets]`);

    ////console.log('link:', link)////

    return async ({ options, owner, path }, ...args) => {
      if (cache.has(path.path)) return cache.get(path.path);

      ////console.log('path.path:', path.path)////

      link.setAttribute("__path__", path.path);
      const propertyValue = getComputedStyle(link)
        .getPropertyValue("--__asset__")
        .trim();
      link.removeAttribute("__path__");

      ////console.log('propertyValue:', propertyValue)////

      if (!propertyValue) Exception.raise(`Invalid path: ${'@' + path.path}`);
      const result = atob(propertyValue.slice(1, -1));
      cache.set(path.path, result);
      return result;
    };
  })()
);

/* Add css type handler to transform CSS text to Sheet instance. */
assets.types.add(
  "css",
  (() => {
    const cache = new Map();
    return async (text, { options, owner, path }, ...args) => {
      const { Sheet } = await owner.get("@/sheet.js");
      if (cache.has(path.path)) {
        return cache.get(path.path);
      }
      const result = Sheet.create(text, path.path);
      cache.set(path.path, result);
      return result;
    };
  })()
);

/* Add js type handler to transform JS text to module or to execute iife. */
assets.types.add(
  "js",
  (() => {
    const cache = new Map();
    return async (text, { options, owner, path }, ...args) => {
      let result;
      const { as = "module" } = options;
      const key = as === "module" ? path.path : `${path.path}?${as}`;
      if (cache.has(key)) {
        return cache.get(key);
      }
      if (as === "module") {
        result = await Module.create(text, path.path);
      } else if (as === "iife") {
        result = Function(`return ${text}`)();
        if (result === undefined) {
          /* Since undefined handler results are ignored, convert to null */
          result = null;
        }
      } else {
        throw new Error(`Invalid 'as': ${as}`);
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

assets.processors.add(
  "css",
  async (result, { options, owner, path }, ...args) => {
    if (typeName(result) !== "CSSStyleSheet")
      Exception.raise(`Result is not a CSSStyleSheet`, () =>
        console.error("Result:", result)
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
  }
);

define(
  globalThis,
  async (...args) => {
    return await assets.get(...args);
  },
  "use"
);
define(use, assets.meta, "meta");



function typeName(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export {};
