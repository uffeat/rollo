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

const iframe = component.iframe( {
  name: 'iworker',
  src: `https://rollohdev.anvil.app?origin=${origin}`,
  $undisplay: true
  
});

await new Promise((resolve, reject) => {
  iframe.on.load({ once: true }, (event) => {
    resolve(iframe.contentWindow);
  });

  app.append(iframe);
});

console.log("contentWindow:", iframe.contentWindow);

if (import.meta.env.DEV) {

  /* Initialize DEV testbench */
  await import("../test");
}
