/* Import engine.

TODO

- 'static' source.
- 'assets' source.. Import by glob
- Synthetic types, e.g., .component.html
- Reconsider Assets as component vs. app composition on assets
*/

/* Import tools for the import engine. */
import { Meta } from "./meta.js";
import { Module } from "./module.js";
import { Path } from "./path.js";
import { Registry } from "./registry.js";
import { define } from "./define.js";

class Assets extends HTMLElement {
  static create = (...args) => new Assets(...args);
  #_ = {
    added: new Map(),
    detail: {},
  };

  constructor() {
    super();
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
    NOTE Operates on 'path.source' with falsy ignored. */
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
    path = Path.create(path);
    const { raw = false } = options;

    let result;
    //console.log("path:", path); ////

    if (this.#_.added.has(path.path)) {
      result = this.#_.added.get(path.path);
      return result;
    }

    if (!this.sources.has(path.source)) {
      throw new Error(`Invalid source: ${path.source}`);
    }
    result = await this.sources.get(path.source)(
      { options: { ...options }, owner: this, path },
      ...args
    );

    /* Create asset from text unless raw or source handler instructs not to do 
    so via mutation of path.detail. */
    if (
      raw !== true &&
      path.detail.transform !== false &&
      this.types.has(path.type)
    ) {
      const transformer = this.types.get(path.type);

      //console.log('transformer:', transformer)////

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

    /* Use asset unless raw or source or type handler instructs not to do so 
    via mutation of path.detail. */
    if (
      raw !== true &&
      path.detail.process !== false &&
      this.processors.has(path.types)
    ) {
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

customElements.define("data-assets", Assets);

const assets = Assets.create();

/* Make selected import engine tools available via import engine. */
assets.add("/module.js", Module);
assets.add("/path.js", Path);
assets.add("/registry.js", Registry);
assets.add("/define.js", define);

/* Add carrier sheet as source */
assets.sources.add(
  "/",
  (() => {
    const cache = new Map();
    const link = document.head.querySelector(`link[assets]`);
    return async ({ options, owner, path }, ...args) => {
      let result;
      if (cache.has(path.path)) {
        result = cache.get(path.path);
      } else {
        //console.log('path:', path.path)////
        link.setAttribute("__path__", path.path);
        const propertyValue = getComputedStyle(link)
          .getPropertyValue("--__asset__")
          .trim();
        link.removeAttribute("__path__");
        if (!propertyValue) {
          throw new Error(`Invalid path: ${path.path}`);
        }
        result = atob(propertyValue.slice(1, -1));
      }
      //console.log("result from '/' source:", result); ////
      return result;
    };
  })()
);

/* Add css type handler 
- to add sheet by link
or
- to transform CSS text to Sheet instance. */
assets.types.add(
  "css",
  (() => {
    const cache = new Map();
    return async (text, { options, owner, path }, ...args) => {
      const head = args.find((a) => a instanceof HTMLHeadElement);
      if (head) {
        /* Escape processing */
        Object.assign(path.detail, { process: false });
        let link = head.querySelector(
          `link[rel="stylesheet"][href="/assets${path.path}"]`
        );
        if (link) {
          return link;
        }
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `/assets${path.path}`;
        const { promise, resolve } = Promise.withResolvers();
        link.addEventListener(
          "load",
          (event) => {
            resolve(link);
          },
          { once: true }
        );
        head.append(link);
        return await promise;
      }

      const { Sheet } = await owner.get("/sheet.js");
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
      const { iife = false } = options;
      const key = iife ? `${path.path}?iife` : path.path;
      if (cache.has(key)) {
        return cache.get(key);
      }
      if (iife) {
        result = Function(text)();
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

assets.processors.add(
  "css",
  async (result, { options, owner, path }, ...args) => {
    if (typeName(result) !== "CSSStyleSheet") {
      console.error("Result:", result);
      throw new Error(`Result is not a CSSStyleSheet`);
    }
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
