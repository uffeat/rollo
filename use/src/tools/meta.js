// Create DEV flag that also works in a non-Vite context and across parcels.
const DEV = location.hostname === "localhost";

/* Determine if running in Vite context */
const VITE =
  typeof import.meta !== "undefined" &&
  typeof import.meta.env !== "undefined" &&
  import.meta.env.MODE;

const server = new (class Server {
  #_ = {};

  get origin() {
    return this.#_.origin;
  }

  set origin(origin) {
    this.#_.origin = origin;
  }
})();

export const meta = new (class Meta {
  #_ = {};

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
        this.#_.ANVIL = true
      }
    }

    this.#_.session = crypto.randomUUID()
  }

  get ANVIL() {
    return this.#_.ANVIL || false;
  }

  get DEV() {
    return DEV;
  }

  /* Returns flag that indicates if running in Vite env. */
  get VITE() {
    return VITE;
  }

  get base() {
    return this.#_.base;
  }

  set base(base) {
    this.#_.base = base;
  }

  get server() {
    return server;
  }

  get session() {
    return this.#_.session;
  }
})();
