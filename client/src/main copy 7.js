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
  #iworker[over]:popover-open {
    opacity: 1;
    @starting-style {
      opacity: 0;
      transform: scale(0.95);
    }
  }
`.use();

function qualify(event, { type } = {}) {
  if (event.origin !== use.meta.server.origin) {
    return;
  }
  if (type && event.data.type !== type) {
    return;
  }
  return true;
}

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

const iworker = new (class {
  #_ = {};

  constructor() {}

  async request(specifier, { test, timeout, visible } = {}) {
    return (...args) => {
      const kwargs = args.find((a, i) => !i && is.object(a)) || {};
      args = args.filter((a, i) => i || !is.object(a));
      return new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = (() => {
          if (timeout) {
            return setTimeout(() => {
              channel.port1.close();
              reject(
                new Error(
                  `Response from '${specifier}' took longer than ${timeout}ms`,
                ),
              );
            }, timeout);
          }
        })();
        if (visible) {
          iframe.attribute.visible = true;
        } else {
          iframe.attribute.visible = null;
        }
        channel.port1.onmessage = (event) => {
          if (timer) {
            clearTimeout(timer);
          }

          if (visible) {
            iframe.attribute.visible = null;
          }

          if (event.data.error) {
            // TODO Consider if should be error
            reject(event.data.error);
          } else {
            resolve(event.data.result);
          }
          channel.port1.close();
        };

        iframe.contentWindow.postMessage(
          {
            submission: Submission(),
            type: "request",
            specifier,
            args,
            kwargs,
            test,
            visible,
          },
          use.meta.server.origin,
          [channel.port2],
        );
      });
    };
  }
})();

class MessageType {
  static create = (...args) => new MessageType(...args);
  #_ = {};

  constructor(event, { type } = {}) {
    const _ = {
      event,
      ok:
        event.origin === use.meta.server.origin &&
        is.object(event.data) &&
        (!type || event.data.type === type),
    };

    if (_.ok) {
      _.data = new Proxy(event.data, {
        get(target, key) {
          return target[key];
        },
      });
    }

    this.#_ = _;
  }

  get data() {
    return this.#_.data;
  }

  get ok() {
    return this.#_.ok;
  }

  respond(...args) {
    const port = this.#_.event.ports[0];
    port.postMessage(...args); ////
  }
}

function Message(...args) {
  return new MessageType(...args);
}

// Set up receiver for updating iframe
window.addEventListener("message", (event) => {
  if (!qualify(event, { type: "iframe" })) {
    return;
  }
  const updates = event.data.detail || {};
  iframe.update(updates);
  const port = event.ports[0];
  port.postMessage(updates); ////
});

// Handshake
await new Promise((resolve, reject) => {
  iframe.update({ popover: "manual", "[over]": true }).showPopover();

  const onmessage = (event) => {
    if (!qualify(event, { type: "ready" })) {
      return;
    }
    window.removeEventListener("message", onmessage);
    const port = event.ports[0];
    // Send init data to iworker
    port.postMessage({ detail: { foo: 42 } });
    // Receive init data from iworker
    const detail = event.data.detail;
    console.log("Init data from iworker:", detail); ////
    use.meta.server.targets = detail.server.targets;
    resolve(detail);
    // iframe.hidePopover(); clean, but unnecessary!
    iframe.update({ popover: null, "[over]": null });
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

/*
iworker
  .request("@@/stuff/", {visible: true})()
  .then((result) => {
    console.log("stuff result:", result);
  });
*/

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
