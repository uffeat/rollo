import { define } from "./tools/define.js";
import { Meta } from "./tools/meta.js";
import { text as _text } from "./tools/text.js";

/* Creates global 'use' import engine. */
export const Use = async ({ env, origin, text = _text } = {}) => {
  /* Check that a global use has not already been declared */
  if (globalThis.use) {
    console.warn(`Global 'use' already exists and will be overwritten.`);
  }

  if (!env) {
    const head =
      window === window.parent ? document.head : window.parent.document.head;
    const element = head.querySelector("meta[env]");
    if (element) {
      env = element.getAttribute("env");
    }
  }

  if (!origin) {
    if (window === window.parent) {
      if (location.hostname === "localhost") {
        origin = document.head
          .querySelector("link[assets]")
          .href.split("/_/")[0];
      } else {
        origin = location.origin;
      }
    } else {
      /* Served as iframe */
      origin = window.parent.location.origin;
    }
  }

  /* Scaffold for core import engine to be progressively enhanced. */
  const assets = new (class Assets {
    #_ = {
      cache: new Map(),
      /* Wrap native import to prevent Vite from barking */
      import_: Function("url", "return import(url)"),
    };

    constructor() {
      this.#_.meta = Meta.create({ env, origin });
    }

    /* Completes 'assets'. Self-destructs. */
    __complete__(Registry, get) {
      this.#_.processors = new (class Processors extends Registry {
        constructor(owner) {
          super(owner);
        }
      })(this);
      this.#_.types = new (class Types extends Registry {
        constructor(owner) {
          super(owner);
        }
      })(this);
      this.#_.get = get.bind(this);
      delete this.__complete__;
    }

    /* */
    get meta() {
      return this.#_.meta;
    }

    /* */
    get processors() {
      return this.#_.processors;
    }

    /* */
    get types() {
      return this.#_.types;
    }

    /* */
    async get(...args) {
      return await this.#_.get(...args);
    }

    /* */
    async import(path) {
      const cache = this.#_.cache;
      if (cache.has(path)) {
        return cache.get(path);
      }
      const js = await this.text(path);
      const url = URL.createObjectURL(
        new Blob(
          [`const __path__ = "${path}";\n${js}\n//# sourceURL=${path}`],
          {
            type: "text/javascript",
          }
        )
      );
      const result = await this.#_.import_(url);
      URL.revokeObjectURL(url);
      cache.set(path, result);
      return result;
    }

    /* */
    async text(path) {
      return await text(path);
    }
  })();

  /* HACK Create temporary global 'use', so that stuff the import engine needs 
  can be imported. */
  let use = (path) => assets.import(path);
  globalThis.use = use;
  use.assets = assets;
  use.meta = assets.meta;


  /* TODO
  - Perhaps all of the below can be moved to inside __complete__ */




  const { Path } = await use("/path.js");
  const { Registry } = await use("/tools/registry.js");
  assets.__complete__(Registry, async function get(path, ...args) {
    const { typename } = await this.import("/tools/type.js");
    const options = args.find((a) => typename(a) === "Object") || {};
    args = args.filter((a) => typename(a) !== "Object");
    if (path.startsWith("@/")) {
      if (!this.meta.env) {
        return;
      }
      const { promise, resolve } = Promise.withResolvers();
      window.parent.dispatchEvent(
        new CustomEvent("_use", {
          detail: {
            target: path,
            callback: (result) => {
              resolve(result);
            },
            args,
            ...options,
          },
        })
      );
      return promise;
    }
    path = Path.create(path);
    const { raw = false } = options;
    if (raw) {
      return await this.text(path.path);
    }
    if (!this.types.has(path.type)) {
      throw new Error(
        `Unsupported type: ${path.type} (reading '${path.path}').`
      );
    }
    const result = await this.types.get(path.type).call(
      this,
      /* Copy options to guard against mutation */
      { options: { ...options }, owner: this, path },
      ...args
    );
    /* Process */
    if (this.processors.has(path.type)) {
      const processed = await this.processors.get(path.type).call(
        this,
        result,
        /* Copy options to guard against mutation */
        { options: { ...options }, owner: this, path },
        ...args
      );
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  });

  /* Add out-of-the-box 'types' and 'processors' handlers.
  NOTE External code can add, change and remove handlers. */
  assets.types
    .add(
      "css",
      (() => {
        const cache = new Map();
        return async ({ owner, path }, ...args) => {
          const heads = args.filter((a) => a instanceof HTMLHeadElement);

          if (heads.length) {
            const { component } = await owner.import("/component.js");
            const href = `${owner.meta.origin}/_/theme/assets${path.path}`;

            for (const head of heads) {
              if (
                head.querySelector(`link[rel="stylesheet"][href="${href}"]`)
              ) {
                continue;
              }
              const { promise, resolve } = Promise.withResolvers();
              const link = component.link({
                rel: "stylesheet",
                href,
              });
              link.on.load$once = (event) => resolve(true);
              head.append(link);
              await promise;
            }
            return;
          } else {
            if (cache.has(path.path)) {
              return cache.get(path.path);
            }
            const { Sheet } = await owner.import("/sheet.js");
            const text = await owner.text(path.path);
            const result = Sheet.create(text, path.path);
            cache.set(path.path, result);
            return result;
          }
        };
      })()
    )
    .processors.add("css", async (result, { owner }, ...args) => {
      const { typename } = await owner.import("/tools/type.js");
      if (typename(result) !== 'CSSStyleSheet') {
        console.error('Result:', result)
        throw new Error(`Result is not a CSSStyleSheet`)
      }
      const targets = args.filter(
        (a) =>
          typename(a) === "HTMLDocument" ||
          a instanceof ShadowRoot ||
          a.shadowRoot
      );
      if (targets.length) {
        /* NOTE sheet.use() adopts to document, therefore check targets' length */
        result.use(...targets);
      }
    })
    .types.add("html", async ({ owner, path }) => await owner.text(path.path))
    .types.add(
      "js",
      (() => {
        /* NOTE cache is for iife's only */
        const cache = new Map();
        return async ({ options, owner, path }) => {
          const { iife = false } = options;
          if (iife) {
            if (cache.has(path.path)) {
              return cache.get(path.path);
            }
            const text = await owner.text(path.path);
            const result = Function(text)();
            cache.set(path.path, result);
            return result;
          } else {
            return await owner.import(path.path);
          }
        };
      })()
    )
    .types.add("json", async ({ owner, path }) =>
      JSON.parse(await owner.text(path.path))
    )
    .types.add("svg", async ({ owner, path }) => await owner.text(path.path));

  use = (...args) => assets.get(...args);
  define(globalThis, use, "use");
  define(use, assets, "assets");
  define(use, assets.meta, "meta");

  /* Send event to inform that import engine is ready. */
  window.parent.dispatchEvent(
    new CustomEvent("_use_ready", {
      detail: use,
    })
  );

  return use;
};
