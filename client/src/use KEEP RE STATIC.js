/* TODO
- raw css.
- Imports by asset carrier sheet.
- Import by glob.
*/

/* Import tools for the import engine. */
import { Meta } from "./tools/meta.js";
import { Module } from "./tools/module.js";
import { Path } from "./tools/path.js";
import { Registry } from "./tools/registry.js";
import { Sheet } from "./tools/sheet.js";
import * as caseTools from "./tools/case.js";
import { define } from "./tools/define.js";
import { truncate } from "./tools/truncate.js";
import * as types from "./tools/types.js";

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
    const options = args.find((a) => types.typeName(a) === "Object") || {};
    args = args.filter((a) => types.typeName(a) !== "Object");
    path = Path.create(path);

    let result;

    if (this.#_.added.has(path.path)) {
      result = this.#_.added.get(path.path);
    } else {
      if (!this.sources.has(path.source)) {
        throw new Error(`Invalid source: ${path.source}`);
      }
      result = await this.sources.get(path.source)(
        { options: { ...options }, owner: this, path },
        ...args
      );

      /* Abort if source handler instructs to do so via mutation of path.detail. */
      if (path.detail.transform === false) {
        return result;
      }
    }

    /* Create asset from text. */
    if (this.types.has(path.type)) {
      const asset = await this.types.get(path.type)(
        result,
        { options: { ...options }, owner: this, path },
        ...args
      );
      /* Ignore undefined type handler result. */
      if (asset !== undefined) {
        result = asset;
      }
    }

    /* Abort if type handler instructs to do so via mutation of path.detail. */
    if (path.detail.process === false) {
      return result;
    }

    /* Use asset. */
    if (this.processors.has(path.types)) {
      const processed = await this.processors.get(path.types)(
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

/* Make import engine tools available via import engine.
NOTE Good practice to '/!'-prefix explicitly added assets. 
Mitigates path ambiguity. */
assets.add("/!meta.js", Meta);
assets.add("/!module.js", Module);
assets.add("/!path.js", Path);
assets.add("/!registry.js", Registry);
assets.add("/!sheet.js", Sheet);
assets.add("/!caseTools.js", caseTools);
assets.add("/!define.js", define);
assets.add("/!truncate.js", truncate);
assets.add("/!types.js", types);

assets.sources.add(
  "/",
  (() => {
    const cache = new Map();
    return async ({ options, owner, path }, ...args) => {
      const { iife = false, raw = false } = options;

      if (path.type === "js") {
        if (iife || raw) {
          Object.assign(path.detail, { transform: false, process: false });
          let text;
          if (cache.has(path.path)) {
            text = cache.get(path.path);
          }
          const response = await fetch(path.path);
          text = await response.text();
          cache.set(path.path, text);
          if (iife) {
            const key = `${path.path}?iife`;
            if (cache.has(key)) {
              return cache.get(key);
            }
            const result = Function(text)();
            cache.set(key, result);
            return result;
          }
          return text;
        }
        const result = await Module.import(path.path);
        return result;
      }
      /* Non-js assets. */
      const heads = args.filter((a) => a instanceof HTMLHeadElement);
      if (path.type === "css" && heads.length) {
        Object.assign(path.detail, { transform: false, process: false });
        for (const head of heads) {
          if (
            !head.querySelector(`link[rel="stylesheet"][href="${path.path}"]`)
          ) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = path.path;
            const { promise, resolve } = Promise.withResolvers();
            link.addEventListener(
              "load",
              (event) => {
                resolve(link);
              },
              { once: true }
            );
            head.append(link);
            await promise;
          }
        }
        
        return true;
      }

      if (cache.has(path.path)) {
        return cache.get(path.path);
      }
      const response = await fetch(path.path);
      const result = await response.text();
      cache.set(path.path, result);
      return result;
    };
  })()
);

/* Transforms CSS text to Sheet instance. */
assets.types.add(
  "css",
  (() => {
    const cache = new Map();
    return async (result, { options, owner, path }, ...args) => {
      if (cache.has(path.path)) {
        return cache.get(path.path);
      }
      result = Sheet.create(result, path.path);
      cache.set(path.path, result);
      return result;
    };
  })()
);

/* Transforms JSON text to JS object.
NOTE Does not cache to avoid mutation issues. */
assets.types.add("json", (result, { options, owner, path }, ...args) => {
  return JSON.parse(result);
});

assets.processors.add(
  "css",
  async (result, { options, owner, path }, ...args) => {
    if (types.typeName(result) !== "CSSStyleSheet") {
      console.error("Result:", result);
      throw new Error(`Result is not a CSSStyleSheet`);
    }
    const targets = args.filter(
      (a) =>
        types.typeName(a) === "HTMLDocument" ||
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

export {};
