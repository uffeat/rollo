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

const { Ref, app, component, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");

css`
  iframe[name="iworker"] {
    width: 100%;
    border: none;
    padding: 0;
    margin: 0;
  }

  iframe[name="iworker"] {
    
    position: absolute;
    top: 0;

    

    
    height: var(--height);
  }

  iframe[name="iworker"][state-hidden] {
    height: 0;
  }

  #app:has(iframe[name="iworker"]:not([state-hidden]))
    > :not([name="iworker"]) {
    /*display: none;*/
  }

  frame-component {
    //height: unset;
  }
`.use();

const iframe = component.iframe({
  name: "iworker",
  src: `${use.meta.server.origin}/iworker?iworker=`,
  //$stateHidden: true,
});

app.append(iframe);

//
//
//iframe.__.height = '500px'
iframe.$.update({ __height: "200px" });
iframe.update({ width: "100px", border: "1px solid green" });
//
//

await new Promise((resolve, reject) => {
  const onmessage = (event) => {
    if (event.origin !== use.meta.server.origin) {
      return;
    }
    if (event.data === "ready") {
      window.removeEventListener("message", onmessage);
      resolve(true);
    }
  };
  window.addEventListener("message", onmessage);
});

const iworker = new (class {
  #_ = {};

  constructor() {
    // Transmit view height to iframe
    app.$.effects.add(
      ({ Y }) => {
        //console.log("Y:", Y); ////
        iframe.contentWindow.postMessage(
          { type: "Y", Y },
          use.meta.server.origin,
        );
      },
      ["Y"],
    );
  }

  request({ timeout, visible } = {}) {
    return (specifier, ...args) => {
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
          { type: "request", specifier, args, visible },
          use.meta.server.origin,
          [channel.port2],
        );
      });
    };
  }
})();

iworker
  .request({ visible: true })("@@/echo/", 42)
  .then((result) => {
    console.log("echo result:", result); ////
  });

iworker
  .request({ visible: true })("@@/echo/", 42)
  .then((result) => {
    console.log("echo result:", result); ////
  });
