/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  //await use("/parcels/main/main.css");
  await import("@/dev.css");
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
  iframe[name="iworker"] {
    position: var(--position, absolute);
    top: var(--top, 0);
    height: var(--height, 0);
    width: 100%;
    border: none;
    padding: 0;
    margin: 0;
  }
`.use();

const iframe = component.iframe({
  name: "iworker",
  src: `${use.meta.server.origin}/iworker?iworker=`,
  slot: "iworker",
});

app.append(iframe);

iframe.update({ __height: "100vh" });

// Init handshake
const data = await new Promise((resolve, reject) => {
  const onmessage = (event) => {
    if (event.origin !== use.meta.server.origin) {
      return;
    }
    if (event.data.type !== "ready") {
      return;
    }
    window.removeEventListener("message", onmessage);
    const data = event.data.data;
    console.log("data:", data);
    resolve(data);
  };
  window.addEventListener("message", onmessage);
});

const iworker = new (class {
  #_ = {};

  constructor() {}

  request(specifier, { test, timeout } = {}) {
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
        channel.port1.onmessage = (event) => {
          if (timer) {
            clearTimeout(timer);
          }
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data.result);
          }
          channel.port1.close();
        };
        iframe.contentWindow.postMessage(
          { type: "request", specifier, args, kwargs, test },
          use.meta.server.origin,
          [channel.port2],
        );
      });
    };
  }
})();

// Set up display receiver
window.addEventListener("message", (event) => {
  if (event.origin !== use.meta.server.origin) {
    return;
  }
  if (event.data.type !== "display") {
    return;
  }
  const data = event.data.data || {};
  //console.log("Display data:", data); ////
  iframe.update(data);

  const port = event.ports[0];
  port.postMessage(true);
});

// Conclude handshake
iframe.contentWindow.postMessage(
  {
    type: "ready",
    data: { browser: { session: use.meta.session, token: use.meta.token } },
  },
  use.meta.server.origin,
);

iframe.update({ __height: 0 });

// Test

iworker
  .request("@@/echo/", { test: true })(42)
  .then((result) => {
    console.log("result:", result); ////
  });

iworker
  .request("@@/echo:ping", { test: true })()
  .then((result) => {
    console.log("result:", result); ////
  });

iworker
  .request("rpc/echo")(42)
  .then((result) => {
    console.log("result:", result); ////
  });


// TODO spinner option

iworker
  .request("api/echo")(42)
  .then((result) => {
    console.log("result:", result); ////
  });

/*
iworker
  .request("@@/foo/")()
  .then((result) => {
    console.log("result:", result);
  });
  */

iworker
  .request("@@/stuff/")()
  .then((result) => {
    console.log("stuff result:", result); ////
  });

await (async () => {
  const { server } = await use("@/server");
  const { response, result, meta } = await server.echo(42);
  //console.log("result:", result);
  console.log("meta:", meta);
})();
