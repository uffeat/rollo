const BASE = "https://rolloh.vercel.app";

const server = new (class {
  #_ = {};

  constructor() {
    const dev = "https://rollohdev.anvil.app";
    const prod = "https://rolloh.anvil.app";
    // Set origin
    this.#_.origin =
      location.origin === BASE || location.origin === prod ? prod : dev;
    // Set PROD
    this.#_.PROD = this.#_.origin === prod;
    // Set DEV
    this.#_.DEV = !this.#_.PROD;
    // Set env
    this.#_.env = this.#_.PROD ? "production" : "development";
  }

  get DEV() {
    return this.#_.DEV;
  }

  get PROD() {
    return this.#_.PROD;
  }

  get env() {
    return this.#_.env;
  }

  get origin() {
    return this.#_.origin;
  }

  get targets() {
    return this.#_.targets;
  }

  set targets(targets) {
    this.#_.targets = targets;
  }
})();

export const meta = new (class {
  #_ = {
    detail: {},
  };

  constructor() {
    const PORT = "3869";
    // Set PROD
    this.#_.PROD = location.origin === BASE;
    // Set DEV
    this.#_.DEV = !this.#_.PROD;
    // Set ANVIL
    this.#_.ANVIL = server.origin === location.origin;
    // Set VITE
    this.#_.VITE =
      typeof import.meta !== "undefined" &&
      typeof import.meta.env !== "undefined" &&
      import.meta.env.MODE;
    // Set base
    this.#_.base = (() => {
      // Port-awareness allows access to dev public when testing parcels
      // (provided that dev sever runs)
      if (this.#_.DEV && location.port !== PORT) {
        return `http://localhost:${PORT}`;
      }
      // Not DEV
      if (location.origin !== BASE) {
        return BASE;
      }
      return "";
    })();
    // Set env
    this.#_.env = this.#_.PROD ? "production" : "development";
  }

  get ANVIL() {
    return this.#_.ANVIL;
  }

  /* Returns production origin */
  get BASE() {
    return BASE;
  }

  get DEV() {
    return this.#_.DEV;
  }

  get PROD() {
    return this.#_.PROD;
  }

  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return this.#_.VITE;
  }

  get base() {
    return this.#_.base;
  }

  get detail() {
    return this.#_.detail;
  }

  get env() {
    return this.#_.env;
  }

  get server() {
    return server;
  }

  
})();
