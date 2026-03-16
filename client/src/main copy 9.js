/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  //await import("@/dev.css");
}

//const { user } = await use("@/user/");

const { server } = await use("@/server");

const { Ref, app, component, css, is } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");

css`
  /* NOTE Vars allow control from JS. */

  /* Base for iworker (iframe). */
  #iworker {
    /* Declare vars; explicitly to avoid unintended var use from higher-ups. */
    --height: 0;
    --position: static;
    --top: 0;
    --width: 100%;
    /* Use vars */
    height: var(--height);
    position: var(--position);
    top: var(--top);
    width: var(--width);
    /* Vanilla items */
    border: none;
    padding: 0;
    margin: 0;
  }

  #iworker[over] {
    --position: fixed;
  }

  /* Anchor frame (layout component) when iworker shown as overlay */
  #frame:has(#iworker[over]) {
    anchor-name: --frame;
  }
  /* Iworker as overlay (popover) */
  #iworker[over] {
    --height: anchor-size(height);
    --top: anchor(top);
    position-anchor: var(--anchor, --frame);
    left: var(--left, anchor(left));
  }
  #iworker[over]:not([handshake]):popover-open {
    opacity: 1;
    @starting-style {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  #iworker[over][handshake]:popover-open {
    opacity: 0.75;
  }
`.use();

const Submission = (() => {
  let count = 0;
  return () => count++;
})();

const iframe = component.iframe({
  id: "iworker",
  name: "iworker",
  src: `${use.meta.server.origin}/iworker?iworker=`,
  slot: "iworker",
});

frame.append(iframe);

class Channel {
  static create = (...args) => new Channel(...args);
  #_ = {};

  constructor() {
    this.#_.channel = new MessageChannel();
  }

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

const iworker = new (class {
  #_ = {};

  constructor() {}

  request(specifier, { test, timeout, visible = false } = {}) {
    return (...args) => {
      const kwargs = args.find((a, i) => !i && is.object(a)) || {};
      args = args.filter((a, i) => i || !is.object(a));
      return new Promise((resolve, reject) => {
        const channel = Channel.create();
        const timer = (() => {
          if (timeout) {
            return setTimeout(() => {
              channel.close();
              iframe.attribute.visible = !visible;
              reject(
                new Error(
                  `Response from '${specifier}' took longer than ${timeout}ms`,
                ),
              );
            }, timeout);
          }
        })();
        iframe.attribute.visible = visible;
        channel.receive((event) => {
          if (timer) {
            clearTimeout(timer);
          }
          if (event.data.error) {
            // TODO Consider if should be error
            reject(event.data.error);
          } else {
            resolve(event.data.result);
          }
          channel.close();
          iframe.attribute.visible = !visible;
        });
        channel.send({
          submission: Submission(),
          type: "request",
          specifier,
          args,
          kwargs,
          test,
          visible,
        });
      });
    };
  }
})();


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
    port.postMessage({ detail, submission: this.submission, type: this.type }); ////
  }
};

// Set up receiver for updating iframe
window.addEventListener("message", (event) => {
  const message = Message.create(event, { type: "iframe" });
  if (!message.ok) {
    return;
  }
  const updates = message.detail || {};
  iframe.update(updates);
  message.respond(updates);
});

// Handshake
await new Promise((resolve, reject) => {
  iframe.update({ popover: "manual", "[over]": true, "[handshake]": true }).showPopover();
  const onmessage = (event) => {
    const message = Message.create(event, { type: "handshake" });
    if (!message.ok) {
      return;
    }
    window.removeEventListener("message", onmessage);
    // Send init data to iworker
    message.respond({ foo: 42 });
    // Receive init data from iworker
    console.log("Init data from iworker:", message.detail); ////
    use.meta.server.targets = message.detail.server.targets;
    resolve(message.detail);
    // iframe.hidePopover(); clean, but unnecessary!
    iframe.update({ popover: null, "[over]": null, "[handshake]": null });
  };
  window.addEventListener("message", onmessage);
});

// Test
// TODO Next up INTEGRATE INTO use

/*
iworker
  .request("@@/echo/", { test: true })(42)
  .then((result) => {
    console.log("@@/echo/ result:", result); ////
  });
*/

/*
iworker
  .request("@@/echo:ping", { test: true })()
  .then((result) => {
    console.log("@@/echo:ping result:", result); ////
  });
*/

/*
iworker
  .request("rpc/echo")(42)
  .then((result) => {
    console.log("rpc/echo result:", result); ////
  });
*/


/*
iworker
  .request("rpc/echo")(43)
  .then((result) => {
    console.log("rpc/echo result:", result); ////
  });
*/

/*
iworker
  .request("api/echo")(42)
  .then((result) => {
    console.log("api/echo result:", result); ////
  });
  */


  /*
iworker
  .request("@@/foo/", { visible: true })()
  .then((result) => {
    console.log("foo result:", result);
  });
*/



iworker
  .request("@@/stuff/", {visible: true})()
  .then((result) => {
    console.log("stuff result:", result);
  });


/*
iworker
  .request("@@/login/")()
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

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
