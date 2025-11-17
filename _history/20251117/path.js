/* Utility for parsing path.
NOTE export to enable testing */
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
    /* Base path and query */
    const [path, query] = specifier.split("?");
    this.#_.query = Object.freeze(
      query ? Array.from(new URLSearchParams(query).keys()) : []
    );
    /* Source */
    this.#_.source = path.split("/").at(0);
    /* Specifiers with file */
    this.#_.file = path.split("/").at(-1) || undefined;
    if (this.#_.file) {
      /* File details */
      this.#_.stem = this.#_.file.split(".").at(0);
      this.#_.type = this.#_.file.split(".").at(-1);
      const [_, ...types] = this.#_.file.split(".");
      this.#_.types = types.join(".");
      /* Parts and path with correction of '//' shorthand */
      this.#_.parts = [];
      path
        .slice(this.#_.source.length + 1)
        .split("/")
        .forEach((part, index, parts) => {
          if (part) {
            this.#_.parts.push(part);
          } else {
            /* part represents the empty space between '//'. Get next dir or file stem */
            if (index === parts.length - 2) {
              /* Next is file */
              this.#_.parts.push(this.#_.stem);
            } else {
              /* Next is a dir */
              this.#_.parts.push(parts[index + 1]);
            }
          }
        });
      Object.freeze(this.#_.parts);
      this.#_.path = `/${this.#_.parts.join("/")}`;
      /* full */
      this.#_.full = `${this.#_.source || ""}${this.#_.path}`;
    }
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

  /* Returns full file path (source excluded). */
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

  /* Returns specifier (subject to reconstruction). */
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