import "../../use";
import { Message } from "../tools/message";
import { iframe } from "../tools/iframe";

export class Sync {
  static create = (...args) => new Sync(...args);
  #_ = {};

  constructor() {
    this.#_.onmessage = (event) => {
      const message = Message.create(event, { type: "iframe" });
      if (!message.ok) {
        return;
      }
      const updates = message.detail || {};
      use.meta.DEV &&
        //console.log("Client received updates for iframe:", updates); ////
        iframe.update(updates);
      //iframe.$(updates);
      message.respond(updates);
    };
  }

  get active() {
    return this.#_.active;
  }

  start() {
    if (!this.active) {
      this.#_.active = true;
      window.addEventListener("message", this.#_.onmessage);
    }
  }

  stop() {
    if (this.active) {
      delete this.#_.active;
      window.removeEventListener("message", this.#_.onmessage);
    }
  }
}
