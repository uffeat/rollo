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
      detail: {},
      /* Wrap native import to prevent Vite from barking */
      import_: Function("url", "return import(url)"),
    };

    constructor() {
      this.#_.meta = Meta.create({ env, origin });
    }

    /* Completes 'assets'. Self-destructs (always wanted to write that...). */
    async _setup() {
      /* HACK Create temporary global 'use', so that stuff the import engine needs 
      can be imported. */
      const use = (path) => assets.import(path);
      globalThis.use = use;
      use.assets = assets;
      use.meta = assets.meta;
      const { Path } = await use("/path.js");
      const { Registry } = await use("/tools/registry.js");
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
      /* Create vassets controller */
      this.#_.vassets = new (class VAssets extends Registry {
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
      /* Create get method */
      this.#_.get = async (path, ...args) => {
        const { typename } = await this.import("/tools/type.js");
        const options = args.find((a) => typename(a) === "Object") || {};
        args = args.filter((a) => typename(a) !== "Object");
        path = Path.create(path);

        /* Raw */
        const { raw = false } = options;
        if (raw) {
          return await this.text(path.path);
        }

        /* Import */
        const result = await (async () => {
          /* Virtual asset: Path-specific asset added at runtime. 
          Useful during DEV for overwriting committed assets. */
          if (this.vassets.has(path.path)) {
            return await this.vassets
              .get(path.path)
              .call(
                this,
                { options: { ...options }, owner: this, path },
                ...args
              );
          }
          /* Alternative source */
          if (this.sources.has(path.source)) {
            return await this.sources
              .get(path.source)
              .call(
                this,
                { options: { ...options }, owner: this, path },
                ...args
              );
          }
          /* Standard import */
          if (!this.types.has(path.type)) {
            throw new Error(
              `Unsupported type: ${path.type} (reading '${path.path}').`
            );
          }
          return await this.types
            .get(path.type)
            .call(
              this,
              { options: { ...options }, owner: this, path },
              ...args
            );
        })();

       

        /* Abort if typeless path (unsuitable for processing). */
        if (!path.type) {
          return result;
        }

        /* Process */
        if (this.processors.has(path.type)) {
          const processed = await this.processors.get(path.type).call(
            this,
            result,

            { options: { ...options }, owner: this, path },
            ...args
          );
          if (processed !== undefined) {
            return processed;
          }
        }
        return result;
      };
      /* BOOM! */
      delete this._setup;
    }

    /* Returns detail for ad-hoc data. */
    get detail() {
      return this.#_.detail;
    }

    /* Returns meta data. */
    get meta() {
      return this.#_.meta;
    }

    /* Returns processors controller. */
    get processors() {
      return this.#_.processors;
    }

    /* Returns sources controller. */
    get sources() {
      return this.#_.sources;
    }

    /* Returns types controller. */
    get types() {
      return this.#_.types;
    }

    /* Returns virtual assets controller. */
    get vassets() {
      return this.#_.vassets;
    }

    /* Imports, processes and returns asset. */
    async get(...args) {
      return await this.#_.get(...args);
    }

    /* Imports and returns JS module. */
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

    /* Imports and returns asset as text. */
    async text(path) {
      return await text(path);
    }
  })();

  await assets._setup();

  /* Add out-of-the-box, 'types' and 'processors' handlers.
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
      if (typename(result) !== "CSSStyleSheet") {
        console.error("Result:", result);
        throw new Error(`Result is not a CSSStyleSheet`);
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

  /* Repackage and make 'use' global */
  const use = (...args) => assets.get(...args);
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
