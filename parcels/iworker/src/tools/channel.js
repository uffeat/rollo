import "../../use";
import { iframe } from "./iframe";

/* MessageChannel controller (DX). */
export class Channel {
  static create = (...args) => new Channel(...args);
  #_ = {
    channel: new MessageChannel(),
  };

  constructor() {}

  close() {
    this.#_.channel.port1.close();
  }

  receive(onmessage) {
    this.#_.channel.port1.onmessage = onmessage;
  }

  send(detail = {}) {
    iframe.contentWindow.postMessage(detail, use.meta.server.origin, [
      this.#_.channel.port2,
    ]);
  }
}
