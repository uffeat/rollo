/* Create DEV flag that also works in a non-Vite context. */
const DEV = location.hostname === "localhost";

const PORT = "3869";

/* Determine if running in Vite context */
const VITE =
  typeof import.meta !== "undefined" &&
  typeof import.meta.env !== "undefined" &&
  import.meta.env.MODE;

const server = new (class {
  #_ = {};
  get origin() {
    return this.#_.origin;
  }

  set origin(origin) {
    this.#_.origin = origin;
  }
})();

class Meta {
  #_ = {};

  constructor() {
    const BASE = "https://rolloh.vercel.app";

    /* Server */
    server.origin = DEV
      ? "https://rollohdev.anvil.app"
      : "https://rolloh.anvil.app";

    /* Base */
    if (DEV) {
      if (location.port === PORT) {
        this.#_.base = "";
      } else {
        /* Port-awareness allows access to dev public when testing parcels. */
        this.#_.base = `http://localhost:${PORT}`;
      }
    } else {
      if (location.origin === BASE) {
        this.#_.base = "";
      } else {
        this.#_.base = BASE;
      }
    }
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
}

export const meta = new Meta();
