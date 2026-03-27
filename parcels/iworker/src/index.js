import "../use";

const { server } = await use("@/server");

const { app, component, css, is } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");



  const Submission = (() => {
    let count = 0;
    return () => count++;
  })();

  export const iframe = component.iframe({
    id: "iworker",
    name: "iworker",
    src: `${use.meta.server.origin}/iworker?iworker=`,
    slot: "iworker",

    //__height: 0,
  });

  frame.append(iframe);

  /* MessageChannel controller (DX). */
  class Channel {
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

  /* Wrapper for message events */
  class Message {
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

  const iworker = new (class {
    #_ = {
      /* Tail of the show() serialization chain. Initialized as an
      already-resolved promise so the very first caller starts immediately
      without waiting. Each call advances this pointer to its own promise,
      forming a linked chain that enforces one-at-a-time execution. */
      queue: Promise.resolve(),
    };

    constructor() {
      this.#_.sync = new (class {
        #_ = {};

        constructor(owner) {
          this.#_.owner = owner;

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
      })(this);
    }

    get sync() {
      return this.#_.sync;
    }

    async request(specifier, ..._args) {
      const [options, kwargs, args] = this.#parseArgs(_args);
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
        const [options, kwargs, args] = this.#parseArgs(_args);
        const { visible=true } = options;
        const submission = Submission();
        return new Promise((resolve, reject) => {
          const channel = Channel.create();
          if (visible === "popover") {
            iframe
              .update({ popover: "manual", __height: "100vh" })
              .showPopover();
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

    #parseArgs(args) {
      const options = args.find((a, i) => !i && is.object(a)) || {};
      const kwargs =
        args.find((a, i) => (!i || i === 1) && is.object(a) && a !== options) ||
        {};
      args = args.filter((a, i) => a !== options && a !== kwargs);
      return [options, kwargs, args];
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