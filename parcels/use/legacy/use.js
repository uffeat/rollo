/* TODO
- Refactoring to parcel. 
*/

/* Creates global 'use' asset import engine. */
export default async ({ env, origin, text } = {}) => {
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
      const element = document.head.querySelector(
        "link[development][production]"
      );
      if (element) {
        const origins = [
          element.getAttribute("development"),
          element.getAttribute("production"),
        ];
        if (origins.includes(location.origin)) {
          /* Served as stand-alone document */
          origin = location.origin;
        } else {
          /* Served by dev server */
          origin = origins[0];
        }
        element.removeAttribute("development");
        element.removeAttribute("production");
      } else {
        /* Served as stand-alone document without origin data */
        origin = location.origin;
      }
    } else {
      /* Served as iframe */
      origin = window.parent.location.origin;
    }
  }

  if (!text) {
    text = (() => {
      const cache = new Map();
      return function text(path) {
        if (cache.has(path)) {
          return cache.get(path);
        }
        const element = document.createElement("div");
        element.classList.add("asset");
        element.setAttribute("path", path);
        document.head.append(element);

        const computed = getComputedStyle(element)
          .getPropertyValue("--asset")
          .trim();

        if (!computed) {
          throw new Error(`Invalid path: ${path}`);
        }
        const encoded = computed.slice(1, -1);
        element.remove();
        const result = atob(encoded);
        cache.set(path, result);
        return result;
      };
    })();
  }

  /* Scaffold for core import engine to be progressively enhanced. */
  const assets = new (class Assets {
    #_ = {};

    get _() {
      return this.#_;
    }

    get meta() {
      return this._.meta;
    }

    get processors() {
      return this._.processors;
    }

    get types() {
      return this._.types;
    }

    async get(...args) {
      return await this._.get(...args);
    }

    async import(...args) {
      return await this._.import(...args);
    }

    async text(...args) {
      return await this._.text(...args);
    }
  })();

  /* Add basic asset text import capability. 
  Provides a robust service for 'types' and 'processors' handlers. */
  assets._.text = text;

  /* Add basic module import capability */
  assets._.import = (() => {
    /* HACK Recreate 'import' to prevent wranings, when used in a Vite context. */
    const import_ = Function("url", "return import(url)");
    const cache = new Map();
    return async function (path) {
      /* NOTE Expects 'path' string (not Path instance) */
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
      const result = await import_(url);
      URL.revokeObjectURL(url);
      cache.set(path, result);
      return result;
    };
  })().bind(assets);

  /* HACK Create temporary global 'use', so that modules that only use 'use' 
  for modules import can be imported. Required to enable dog-fooding. */
  globalThis.use = function (...args) {
    return assets.import(...args);
  };

  /* Import stuff that the import engine needs */
  const { Path } = await use("/path.js");
  const { typename } = await use("/tools/type.js");
  const { Registry } = await use("/tools/registry.js");
  const { Sheet } = await use("/sheet.js");
  const { component } = await use("/component.js");

  /* Set meta */
  assets._.meta = (await use("/meta.js")).Meta.create({
    env,
    origin,
  });

  /* Create 'get' method (the center piece of the import engine) */
  assets._.get = async function get(path, ...args) {
    
    const options = args.find((a) => typename(a) === "Object") || {};
    args = args.filter((a) => typename(a) !== "Object");

    if (path.startsWith("@/")) {
      if (!this.meta.env) {
        return
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
  }.bind(assets);

  /* Create 'types' controller as prop */
  assets._.types = new (class Types extends Registry {
    constructor(owner) {
      super(owner);
    }
  })(assets);

  /* Create 'processors' controller as prop */
  assets._.processors = new (class Processors extends Registry {
    constructor(owner) {
      super(owner);
    }
  })(assets);

  /* Prevent further tinkering with internals */
  Object.freeze(assets._);

  /* Add out-of-the-box 'types' and 'processors' handlers.
  NOTE External code can add, change and remove handlers. */
  assets.types
    .add(
      "css",
      (() => {
        const cache = new Map();
        return async ({ owner, path }) => {
          if (cache.has(path.path)) {
            return cache.get(path.path);
          }
          const text = await owner.text(path.path);
          const result = Sheet.create(text, path.path);
          cache.set(path.path, result);
          return result;
        };
      })()
    )
    .processors.add("css", async (result, { owner, path }, ...args) => {
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

      const heads = args.filter((a) => a instanceof HTMLHeadElement);
      if (heads.length) {
        for (const head of heads) {
          const { promise, resolve } = Promise.withResolvers();
          const link = component.link({
            rel: "stylesheet",
            href: `${owner.meta.origin}/_/theme/assets/${path.path}`, ////
          });
          link.on.load$once = (event) => resolve(true);
          head.append(link);
          await promise;
        }
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

  const define = (target, source, name, { frozen = true } = {}) => {
    Object.defineProperty(target, name, {
      configurable: !frozen,
      enumerable: true,
      writable: !frozen,
      value: source,
    });
    return target;
  };

  /** Repackage import engine to a single 'use' function; short non-reserved
   * name with minimal global pollution and a loose association to React.  */
  /* Create global 'use' */
  define(
    globalThis,
    function use(...args) {
      return assets.get(...args);
    },
    "use",
    { frozen: false }
  );
  /* Give 'use' full access to 'assets' */
  define(use, assets, "assets");
  /* Provide shortcut to 'meta' on 'use' */
  define(use, assets.meta, "meta");

  /** Send event to inform that import engine is ready.
   * Relevant, if this module is served as a HTML script.  */
  /* NOTE Use 'window.parent' to cater for embedding. */
  window.parent.dispatchEvent(
    new CustomEvent("_use_ready", {
      detail: use,
    })
  );

  /* XXX Really no need to return 'use', but can be helpful to silence linters 
  in consuming code. Also, convenient, when running  in Anvil.  */
  return use;
};
