/* Activate Tailwind */
import "./main.css";
import { Module } from "./tools/module.js";
import { Path } from "./tools/path.js";
import { Sheet } from "./tools/sheet.js";
import { Registry } from "./tools/registry.js";
import { typeName } from "./tools/type.js";
import { Meta } from "./tools/meta.js";

console.log("/foo".split("/").at(0) || "/");

class Assets extends HTMLElement {
  static create = (...args) => new Assets(...args);
  #_ = {
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

  async get(path, ...args) {
    const options = args.find((a) => typeName(a) === "Object") || {};
    args = args.filter((a) => typeName(a) !== "Object");
    path = Path.create(path);
    if (!this.sources.has(path.source)) {
      throw new Error(`Invalid source: ${path.source}`);
    }
    let result = await this.sources.get(path.source)(
      { options: { ...options }, owner: this, path },
      ...args
    );

    return result;
  }
}

customElements.define("data-assets", Assets);

const assets = Assets.create();

assets.sources.add(
  "/",
  (() => {
    const cache = new Map();
    return async ({ options, owner, path }, ...args) => {
      if (path.type === "js") {
        const result = await Module.import(path.path);
        return result;
      }
      if (cache.has(path.path)) {
        return cache.get(path.path)
      }
      const response = await fetch(path.path)
      const result = await response.text()
      cache.set(path.path, result)
      return result
    };
  })()
);

const image = document.createElement("img");
image.src = "/images/sprocket.webp";
document.body.append(image);

//const { foo } = await Module.import("/test/foo.js");
const { foo } = await assets.get("/test/foo.js");
console.log("foo:", foo);

const fooHtml =  await assets.get("/test/foo.template");
console.log("fooHtml:", fooHtml);
