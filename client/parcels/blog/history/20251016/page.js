class Page {
  static create = (...args) => new Page(...args);
  #_ = { cursor: 0 };

  constructor(source, { chunk = 1 } = {}) {
    this.#_.chunk = chunk;
    this.#_.source = [...source];
    this.#_.size = source.length;
  }

  get chunk() {
    return this.#_.chunk;
  }

  get cursor() {
    return this.#_.cursor;
  }

  get direction() {
    return this.#_.direction;
  }

  get page() {
    return this.#_.page;
  }

  get pages() {
    return this.size / this.chunk;
  }

  get size() {
    return this.#_.size;
  }

  first() {
    return this.get(1);
  }

  get(page) {
    const start = (page - 1) * this.chunk;
    const end = start + this.chunk;
    if (start < 0) {
      return new Error("under");
    }
    if (end > this.size) {
      return new Error("over");
    }

    this.#_.cursor = start; ////

    if (this.#_.page !== page) {
      this.#_.direction = this.#_.page < page;
      this.#_.page = page;
    }
    const result = this.#_.source.slice(start, end);
    return result;
  }

  last() {
    return this.get(this.pages);
  }

  next() {
    const start = this.cursor;
    if (start >= this.size) {
      return new Error("over");
    }
    const end = start + this.chunk;
    this.#_.cursor += this.chunk;
    this.#_.page = end / this.chunk;
    const result = [];
    for (let index = start; index < end; index++) {
      const value = this.#_.source.at(index);
      if (value !== undefined) {
        result.push(value);
      }
    }
    this.#_.direction = true;
    return result;
  }

  previous() {
    const end = this.cursor - this.chunk;
    const start = end - this.chunk;
    if (start < 0) {
      return new Error("under");
    }
    this.#_.cursor -= this.chunk;
    this.#_.page = end / this.chunk;
    const result = [];
    for (let index = end - 1; index >= start; index--) {
      const value = this.#_.source.at(index);
      if (value !== undefined) {
        result.push(value);
      }
    }
    this.#_.direction = false;
    return result.reverse();
  }
}
