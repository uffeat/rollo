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

    this.#_.file = specifier.split("/").at(-1);
    //console.log(`file in ${specifier}:`, this.#_.file);
    this.#_.stem = this.#_.file.split(".").at(0);
    //console.log(`stem of ${specifier}:`, this.#_.stem);
    this.#_.type = this.#_.file.split(".").at(-1);
    //console.log(`type of ${specifier}:`, this.#_.type);

    const parts = specifier.slice(1).split("/");
    //console.log(`parts of ${specifier}:`, parts);
    const constructed = [];
    parts.forEach((part, index, array) => {
      if (part) {
        constructed.push(part);
      } else {
        /* part represents the empty space between //. Get next dir or file stem */
        if (index === array.length - 2) {
          /* Next is file */
          constructed.push(this.#_.stem);
        } else {
          /* Next is a dir */
          constructed.push(array[index + 1]);
        }
      }
    });
    this.#_.path = `/${constructed.join("/")}`;
    //console.log(`path of ${specifier}:`, this.#_.path);
  }

  get _() {
    return this.#_;
  }

  get file() {
    return this.#_.file;
  }

  get path() {
    return this.#_.path;
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
}
