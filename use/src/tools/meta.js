// Create DEV flag that also works in a non-Vite context and across parcels.
const DEV = location.hostname === "localhost";

const server = new (class {
  #_ = {};

  get origin() {
    return this.#_.origin;
  }

  set origin(origin) {
    this.#_.origin = origin;
  }

  get targets() {
    return this.#_.targets;
  }

  set targets(targets) {
    if (this.#_.targets) {
      throw new Error("Cannot change targets.");
    }
    this.#_.targets = targets;
  }
})();

export const meta = new (class {
  #_ = {
    detail: {}
  };

  constructor() {
    // Set ANVIL, base and server origin
    if (DEV) {
      const PORT = "3869";
      if (location.port === PORT) {
        this.#_.base = "";
      } else {
        // Port-awareness allows access to dev public when testing parcels
        this.#_.base = `http://localhost:${PORT}`;
      }
      server.origin = "https://rollohdev.anvil.app";
    } else {
      const BASE = "https://rolloh.vercel.app";
      if (location.origin === BASE) {
        this.#_.base = "";
        server.origin = "https://rolloh.anvil.app";
      } else {
        this.#_.base = BASE;
        server.origin = location.origin;
        this.#_.ANVIL = true;
      }
    }
  }

  get ANVIL() {
    return this.#_.ANVIL || false;
  }

  get DEV() {
    return DEV;
  }

  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    if (!this.#_.VITE) {
      this.#_.VITE =
        typeof import.meta !== "undefined" &&
        typeof import.meta.env !== "undefined" &&
        import.meta.env.MODE;
    }
    return this.#_.VITE;
  }

  get base() {
    return this.#_.base;
  }

  set base(base) {
    this.#_.base = base;
  }

  get detail() {
    return this.#_.detail;
  }

  get server() {
    return server;
  }

  get session() {
    if (!this.#_.session) {
       this.#_.session = crypto.randomUUID();
    }
    return this.#_.session;
  }

  set session(session) {
    if (this.#_.session) {
      throw new Error("Cannot change session.");
    }
    this.#_.session = session;
  }

  get token() {
    if (!this.#_.token) {
      const KEY = "__token__";
      const token = localStorage.getItem(KEY);
      if (token) {
        this.#_.token = token;
      } else {
        this.#_.token = crypto.randomUUID();
        localStorage.setItem(KEY, this.#_.token);
      }
    }
    return this.#_.token;
  }
})();
