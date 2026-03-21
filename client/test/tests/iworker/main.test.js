/*
/iworker/main.test.js
*/

/** NOTE
 Origin data must be hard-coded into meta (client- and iworker-side).
Do update iframe inside requestAnimationFrame -> messes up detection of prop change.
*/

const { server } = await use("@/server");

const { app, component, css, is } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");

export default async () => {
  css`
    /*** NOTE Vars allow dynamic control from JS. */

    /** Base for iworker (iframe). */
    #iworker {
      /* Declare vars; explicitly to avoid unintended var use from higher-ups */
      --height: 0;
      --position: static;
      --top: 0;
      --width: 100%;
      /* Use vars */
      height: var(--height);
      position: var(--position);
      top: var(--top);
      width: var(--width);
      /* Non-dynamic items */
      border: none;
      padding: 0;
      margin: 0;
    }
    /** Declare frame as anchor when iworker shown as popover. */
    #frame:has(#iworker[popover]) {
      anchor-name: --frame;
    }
    /** Iworker as popover. */
    #iworker[popover] {
      --position: fixed;
      /*--height: anchor-size(height);*/
      --top: anchor(top);
      position-anchor: var(--anchor, --frame);
      left: var(--left, anchor(left));
    }
    /** Iworker transition when shown as popover. */
    #iworker[popover]:popover-open {
      opacity: 1;
      @starting-style {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `.use();

  /* Returns unique submission id.
  NOTE
  Since iworker coms are channel-based (beyond handshake),
  there's no need for a submission id to match request-response.
  However, an int-based submission id can still be handy for, e.g.,
  - managing state iworker-side (general or in targets)
  - orchestration of request-response pipes
  - error handling and debugging. */
  const Submission = (() => {
    let count = 0;
    return () => count++;
  })();

  /* Create and add iworker iframe.
  NOTE
  The request is channeled through the iworker server.
  The src query part therefore hits the iworker both
  server and client side. Can be used to send pre-handshake init data
  (interpreted as per conventions). Could be send as b64; even with Python 
  code to be executed iworker-side. */
  const iframe = component.iframe({
    id: "iworker",
    name: "iworker",
    src: `${use.meta.server.origin}/iworker?stuff=`,
    slot: "iworker",
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

    /* Sets up function to receive response. */
    receive(onmessage) {
      this.#_.channel.port1.onmessage = onmessage;
    }

    /* Sends request. */
    send(detail = {}) {
      iframe.contentWindow.postMessage(detail, use.meta.server.origin, [
        this.#_.channel.port2,
      ]);
    }
  }

  /* Wrapper for message events for validation, data extration and responding. */
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

  /* Controller for iworker coms. */
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
              //use.meta.DEV && console.log("Client received updates for iframe:", updates); ////
              iframe.update(updates);
            //iframe.$(updates);  // Do this for reactive updates
            message.respond(updates);
          };
        }

        get active() {
          return this.#_.active;
        }

        /* Makes it possible for iworker to control iframe attrs, classes, 
        CSS vars and props. */
        start() {
          if (!this.active) {
            this.#_.active = true;
            window.addEventListener("message", this.#_.onmessage);
          }
        }

        /* Ignores iworker attempts to control iframe. */
        stop() {
          if (this.active) {
            delete this.#_.active;
            window.removeEventListener("message", this.#_.onmessage);
          }
        }
      })(this);
    }

    /* Controller for managing iworkers ability to update iframe props etc. */
    get sync() {
      return this.#_.sync;
    }

    /* Sends request to iworker and returns reponse.
    NOTE
    - Central workhorse.
    - Allows concurrent calls.
    - Does not interfere with iworker display.
    - 'test' option causes (DEV) iworker to respond by attempting
      to use a target served by a local server (typically served from this repo).
      This allows use of uncommitted iworker targets.
    - Primary use cases:
      - Indirect call of Anvil server functions and HTTP endpoints without cors 
        restrictions - possibly stateful (client or server-side in iworker).
      - Use of Anvil's non-visual user features.
      - Use of client-side-exposed db tables/views.
      - As a DOM-aware and Python-enabled classic iframe, e.g., for data operations
        best suited for Python. */
    async request(specifier, ..._args) {
      const [options, kwargs, args] = this.#parseArgs(_args);
      const { test } = options;
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
          args,
          kwargs,
          options,
          specifier,
          submission: Submission(),
          test,
          type: "request",
        });
      });
      return result;
    }

    /* Special version of the 'request' method. Displays the iworker during
    request-response. Ensures non-concurrency. Setting the 'visible' option 
    to 'popover' shows the iworker as a full-screen overlay; otherwise, the
    iworker is displayed as-is with height sync (from iworker) enabled.
    NOTE
    - Reserved for rare cases, where Anvil offers frontend features not 
      supported by the client app, e.g., built-in modals.
    - Could in principle be integrated into the client router allowing
      authoring of routes as Anvil components; probably not worthwhile. */
    async show(specifier, ..._args) {
      /* Wrap the actual work so it can be handed to .then() as a callback.
      Defers execution until the previous queued show has settled,
      regardless of whether it resolved or rejected. */
      const run = async () => {
        const [options, kwargs, args] = this.#parseArgs(_args);
        const { test, visible = true } = options;
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
            args,
            kwargs,
            options,
            specifier,
            submission,
            test,
            type: "show",
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

  // Test
  // TO:DO Next up INTEGRATE INTO use

  /*
  iworker.request("@@/echo/", { test: true }, 42).then((result) => {
    console.log("@@/echo/ result:", result); ////
  });
  */

  /*
iworker
  .request("@@/echo:ping", { test: true })
  .then((result) => {
    console.log("@@/echo:ping result:", result); ////
  });
*/

  /*
  iworker.request("rpc/echo", 43).then((result) => {
    console.log("rpc/echo result:", result); ////
  });
  */

  /*
iworker
  .request("api/echo", 42)
  .then((result) => {
    console.log("api/echo result:", result); ////
  });
  */

  iworker.show("@@/foo/").then((result) => {
    console.log("@@/foo/ result:", result);
  });

  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });

  /*
  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });
  */

  /*
  await (async () => {
    const response = await iworker.request(
      "rpc/echo",
      { test: true },
      { foo: "FOO" },
      42,
    );
    console.log("rpc/echo response:", response); ////
  })();
  */

  /*
  iworker.request("rpc/echo", { test: true }, {foo: 'FOO'}, 42).then((response) => {
    console.log("rpc/echo response:", response); ////
  });
  */

  /*
  iworker.request("@@/echo/", 8).then((result) => {
    console.log("@@/echo/ result:", result); ////
  });
  */

  /*
iworker
  .show("@@/login/")
  .then((result) => {
    console.log("@@/login/ result:", result);
  });
*/

  /*
await (async () => {
  const { server } = await use("@/server");
  const { response, result, meta } = await server.echo(42);
  //console.log("result:", result);
  console.log("meta:", meta);
})();
*/
};
