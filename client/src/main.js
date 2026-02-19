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

const iframe = component.iframe( {
  name: 'iworker',
  src: `${use.meta.server.origin}?origin=${origin}`,
  $undisplay: true
  
});

await new Promise((resolve, reject) => {
  iframe.on.load({ once: true }, (event) => {
    resolve(iframe.contentWindow);
  });

  app.append(iframe);
});

console.log("contentWindow:", iframe.contentWindow);

const show = component.button('btn.btn-primary.m-3', {parent: frame, 'on.click': (event) => {
  iframe.$.undisplay = false
}}, 'Show iworker')

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
