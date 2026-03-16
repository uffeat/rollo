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

const getHeight = (() => {
  const header = frame.shadow.querySelector("header");
  return () => header.getBoundingClientRect().height;
})();

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

css`
  



  #frame:has(#iworker[overlay]) > :not([slot]) {
    //display: none;
  }

  #frame {
    //display: static;
  }

  #iworker {
    position: var(--position, static);
    top: var(--top, 0);
    height: var(--height, 0);
    width: 100%;
    border: none;
    padding: 0;
    margin: 0;
  }
`.use();

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

  request(specifier, { test, timeout, visible } = {}) {
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

// Set up iframe receiver
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
  iframe.update({ __position: "absolute", __height: "100vh" }); ////
  
  const top = `-${getHeight()}px`
  console.log('top:', top)


  iframe.update({
    __position: "absolute",
    __height: "100vh",
    __top: top,
    //'[overlay]': true,
  
  }); ////

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

    iframe.update({ __position: "static", __height: 0 }); ////
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
