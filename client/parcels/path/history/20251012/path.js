export class Path {
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #_ = {};

  constructor(specifier) {
    this.#_.specifier = specifier;

    /* Base path and query */
    let [path, query] = specifier.split("?");
    this.#_.query = Object.freeze(
      query ? Array.from(new URLSearchParams(query).keys()) : []
    );

    /* File */
    this.#_.file = path.split("/").at(-1);
    this.#_.stem = this.#_.file.split(".").at(0);
    this.#_.type = this.#_.file.split(".").at(-1);
    const [_, ...types] = this.#_.file.split(".");
    this.#_.typeshash = types.join(".");
    this.#_.types = Object.freeze(types);

    /* Source */
    this.#_.source = path.split("/").at(0);

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
  }

  get file() {
    return this.#_.file;
  }

  get parts() {
    return this.#_.parts;
  }

  get path() {
    return this.#_.path;
  }

  get query() {
    return this.#_.query;
  }

  get source() {
    return this.#_.source;
  }

  get specifier() {
    return this.#_.specifier;
  }

  get stem() {
    return this.#_.stem;
  }

  get type() {
    return this.#_.type;
  }

  get types() {
    return this.#_.types;
  }

  get typeshash() {
    return this.#_.typeshash;
  }
}
