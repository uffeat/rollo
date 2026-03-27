import "../../use";

const { is } = await use("@/rollo/");

/* Wrapper for message events */
export class Message {
  static create = (...args) => new Message(...args);
  #_ = {};

  constructor(event, { type } = {}) {
    this.#_ = {
      event,
      ok:
        event.origin === use.meta.server.origin &&
        is.object(event.data) &&
        (!type || event.data.type === type),
      type,
    };
  }

  get detail() {
    return this.#_.event.data.detail || null;
  }

  get event() {
    return this.#_.event;
  }

  get ok() {
    return this.#_.ok;
  }

  get submission() {
    return this.#_.event.data.submission || null;
  }

  get type() {
    return this.#_.type || null;
  }

  respond(detail = {}) {
    const port = this.#_.event.ports[0];
    port.postMessage({
      detail,
      submission: this.submission,
      type: this.type,
    }); ////
  }
}
