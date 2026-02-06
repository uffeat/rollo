class Meta {
  #_ = {
    detail: {},
  };

  constructor() {
    const PORT = "3869";
    const BASE = "https://rolloh.vercel.app";
    /* Determine if running in Vite context */
    this.#_.VITE =
      typeof import.meta !== "undefined" &&
      typeof import.meta.env !== "undefined" &&
      import.meta.env.MODE;
    /* Create DEV flag that also works in a non-Vite context. */
    this.#_.DEV = location.hostname === "localhost";
    this.#_.env = this.#_.DEV ? "development" : "production";
    this.#_.embedded = window !== window.parent;
    /* Companion */
    this.#_.companion = new (class {
      #_ = {};
      constructor(owner) {
        this.#_.owner = owner;
        if (this.#_.owner.embedded) {
          this.#_.origin = window.parent.location.origin;
        } else {
          this.#_.origin = this.#_.owner.DEV
            ? "https://rollohdev.anvil.app"
            : "https://rolloh.anvil.app";
        }
      }
      get origin() {
        return this.#_.origin;
      }
    })(this);
    /* Base */
    if (this.embedded) {
      this.#_.base = BASE;
    } else {
      if (this.DEV) {
        if (location.port === PORT) {
          this.#_.base = "";
        } else {
          /* Port-awareness allows access to dev public when testing parcels. */
          this.#_.base = `http://localhost:${PORT}`;
        }
      } else {
        if (this.origin === this.companion.origin) {
          this.#_.base = BASE;
        } else {
          this.#_.base = "";
        }
      }
    }
  }

  get DEV() {
    return this.#_.DEV;
  }

  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return this.#_.VITE;
  }

  get base() {
    return this.#_.base;
  }

  set base(base) {
    this.#_.base = base;
  }

  get companion() {
    return this.#_.companion;
  }

  get detail() {
    return this.#_.detail;
  }

  get embedded() {
    return this.#_.embedded;
  }

  get env() {
    return this.#_.env;
  }

  get origin() {
    return location.origin;
  }
}

export const meta = new Meta()
