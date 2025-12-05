export class Path {
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #_ = {
    detail: {},
  };

  constructor(specifier) {
    this.#_.specifier = specifier;
    /* Query */
    const [path, query] = specifier.split("?");
    this.#_.query = Object.freeze(
      query ? Array.from(new URLSearchParams(query).keys()) : []
    );
    const parts = path.split("/");
    /* Trailing '/' */
    if (parts.at(-1) === "") {
      parts[parts.length - 1] = `${parts[parts.length - 2]}.js`;
    }
    /* Double '/' */
    if (!specifier.startsWith("/") && parts.includes("")) {
      const index = parts.findIndex((p) => p === "");
      const next = parts[index + 1];
      parts[index] = next.split(".")[0];
    }
    /* Missing type -> default to js */
    const file = parts.at(-1);
    if (!file.includes(".")) {
      parts[parts.length - 1] = `${file}.js`;
    }

    this.#_.source = parts.at(0);
    this.#_.file = parts[parts.length - 1];
    this.#_.stem = this.#_.file.split(".").at(0);
    this.#_.type = this.#_.file.split(".").at(-1);
    const [_, ...types] = this.#_.file.split(".");
    this.#_.types = types.join(".");
    this.#_.path = `/${parts.slice(1).join("/")}`;
    this.#_.full = parts.join("/");
    this.#_.parts = Object.freeze(parts);
  }

  /* Returns detail for ad-hoc data. */
  get detail() {
    return this.#_.detail;
  }

  /* Returns file name with types(s). */
  get file() {
    return this.#_.file;
  }

  /* Returns full path (incl. source). */
  get full() {
    return this.#_.full;
  }

  /* Returns array of dir/file parts (source excluded). */
  get parts() {
    return this.#_.parts;
  }

  /* Returns path (source excluded, but always starting with '/'). */
  get path() {
    return this.#_.path;
  }

  /* Returns query array. */
  get query() {
    return this.#_.query;
  }

  /* Returns source name. */
  get source() {
    return this.#_.source || "/";
  }

  /* Returns specifier. */
  get specifier() {
    return this.#_.specifier;
  }

  /* Returns file stem. */
  get stem() {
    return this.#_.stem;
  }

  /* Returns declared file type. */
  get type() {
    return this.#_.type;
  }

  /* Returns string with pseudo files types and declared file type. */
  get types() {
    return this.#_.types;
  }

  /* Returns 'Path' instance (of specifier, if 'raw') created current instance, 
  but with replaced file type(s). */
  as(types, { raw = false } = {}) {
    if (!this.#_.file) {
      throw new Error(`No file.`);
    }
    const specifier = `${this.source}${this.path.slice(
      0,
      -this.types.length
    )}${types}${this.query.length ? "?" : ""}${this.query.join("&")}`;
    if (raw) {
      return specifier;
    }
    return new Path(specifier);
  }
}