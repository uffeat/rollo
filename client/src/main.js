/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";

import { Id } from "./tools";

const { app, Sheet, component, element, css, typeName, is } = await use(
  "@/rollo/"
);
const { frame } = await use("@/frame/");

if (import.meta.env.DEV) {
  /* Initialize simulated Anvil iframe
  NOTE Purge when real thing implemented */
  const anvil = component.iframe({
    src: "http://localhost:8069",
    slot: "data",
  });

  const promise = new Promise((resolve) => {
    const onready = (event) => {
      if (event.origin !== anvil.src.slice(0, -1) || event.data !== "ready") {
        return;
      }
      window.removeEventListener("message", onready);
      resolve(anvil.contentWindow);
    };
    window.addEventListener("message", onready);
  });

  app.append(anvil);

  const contentWindow = await promise;

  window.addEventListener("message", async (event) => {
    if (
      event.origin !== anvil.src.slice(0, -1) ||
      !is.object(event.data) ||
      event.data.type !== "use"
    ) {
      return;
    }
    const { specifier } = event.data;
    //console.log("specifier:", specifier); ////
    const data = await use(specifier, { raw: true });
    contentWindow.postMessage({ type: "use", data, specifier }, anvil.src);
  });

  const request = (target, data) => {
    const id = Id();
    const { promise, resolve } = Promise.withResolvers();

    const onresponse = (event) => {
      if (
        event.origin !== anvil.src.slice(0, -1) ||
        !is.object(event.data) ||
        event.data.type !== "response" ||
        event.data.id !== id
      ) {
        return;
      }
      window.removeEventListener("message", onresponse);
      resolve(event.data.data);
    };
    window.addEventListener("message", onresponse);

    contentWindow.postMessage({ id, target, data, type: "request" }, anvil.src);

    return promise;
  };

  /* Test */
  request("echo", 42).then((data) => {
    console.log("data:", data);
  });
  /* Initialize DEV testbench */
  await import("../test");
}
