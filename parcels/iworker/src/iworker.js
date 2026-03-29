import "../use";
import { Channel } from "./tools/channel";
import { Message } from "./tools/message";
import { Submission } from "./tools/submission";
import { Sync } from "./compositions/sync";
import { iframe } from "./tools/iframe";
import { parse } from "./tools/parse";

if (import.meta.env.DEV) {
  /* NOTE Dark mode set here (rather than in test.js) to avoid flickering. */
  document.documentElement.dataset.bsTheme = "dark";
}

export const iworker = new (class {
  #_ = {
    /* Tail of the show() chain. Initialized as an
    already-resolved promise so the very first caller starts immediately
    without waiting. Each call advances this pointer to its own promise,
    forming a linked chain that enforces one-at-a-time execution. */
    queue: Promise.resolve(),
    sync: Sync.create(),
  };

  constructor() {}

  get sync() {
    return this.#_.sync;
  }

  async request(specifier, ..._args) {
    const [options, kwargs, args] = parse(_args);
    const result = await new Promise((resolve, reject) => {
      const channel = Channel.create();
      channel.receive((event) => {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data.result);
        }
        channel.close();
      });
      channel.send({
        submission: Submission(),
        type: "request",
        specifier,
        args,
        kwargs,
        options,
      });
    });
    return result;
  }

  async show(specifier, ..._args) {
    /* Wrap the actual work so it can be handed to .then() as a callback.
    This defers execution until the previous queued show has settled,
    regardless of whether it resolved or rejected. */
    const run = async () => {
      const [options, kwargs, args] = parse(_args);
      const { visible = true } = options;
      const submission = Submission();
      return new Promise((resolve, reject) => {
        const channel = Channel.create();
        if (visible === "popover") {
          iframe.update({ popover: "manual", __height: "100vh" }).showPopover();
        } else {
          this.sync.start();
        }
        channel.receive((event) => {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data.result);
          }
          channel.close();
          iframe.update({ __height: 0 });
          if (visible === "popover") {
            // iframe.hidePopover(); clean, but unnecessary!
            iframe.update({ popover: null });
          } else {
            this.sync.stop();
          }
        });
        channel.send({
          submission,
          type: "show",
          specifier,
          args,
          kwargs,
          options,
          visible,
        });
      });
    };
    /* Chain this call onto the current tail. .then(run) means `run` will not
    be called until the previous show has fully settled (resolved or
    rejected), guaranteeing strict one-at-a-time execution for any number
    of concurrent callers. */
    const tail = this.#_.queue.then(run);
    /* Advance the queue pointer to the new tail. We swallow any rejection
    here so that a failed show does not stall the callers behind it — they
    will proceed normally. The original `tail` below still rejects for the
    caller who owns this particular show. */
    this.#_.queue = tail.catch(() => {});
    return tail;
  }
})();

// Handshake
await new Promise((resolve, reject) => {
  const onmessage = (event) => {
    const message = Message.create(event, { type: "handshake" });
    if (!message.ok) {
      return;
    }
    window.removeEventListener("message", onmessage);
    // Send init data to iworker
    message.respond({ foo: 42 });
    // Receive init data from iworker
    //use.meta.DEV && console.log("Init data from iworker:", message.detail); ////
    use.meta.server.targets = message.detail.server.targets;
    resolve(message.detail);
  };
  window.addEventListener("message", onmessage);
});



