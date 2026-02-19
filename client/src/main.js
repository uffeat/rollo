/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  await use("/parcels/main/main.css");
}

const { app, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const iframe = component.iframe({
  name: "iworker",
  src: `${use.meta.server.origin}?iworker=`,

  $stateHidden: true,
});

await new Promise((resolve, reject) => {
  iframe.on.load({ once: true }, (event) => {
    resolve(iframe.contentWindow);
  });
  app.append(iframe);
});

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

console.log("contentWindow:", iframe.contentWindow); ////

const show = component.button(
  "btn.btn-primary.m-3",
  {
    parent: frame,
    "on.click": (event) => {
      iframe.$.stateHidden = false;
    },
  },
  "Show iworker",
);

const request = async (specifier, ...args) => {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data.result);
      }
      channel.port1.close();
    };
    iframe.contentWindow.postMessage(
      { type: "request", specifier, args },
      use.meta.server.origin,
      [channel.port2],
    );
  });
};

request("echo", 42).then((result) => {
  console.log("result:", result);
});

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
