/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
//import "@/routes";

const { app, component } = await use("@/rollo/");

const iframe = component.iframe({src: 'https://rollohdev.anvil.app'})


app.append(iframe)

if (import.meta.env.DEV) {
  await use('/parcels/main/main.css')
  /* Initialize DEV testbench */
  await import("../test");
}
