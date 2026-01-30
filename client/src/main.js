/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";


const { InputFile, app, component, is, css, ref } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { server } = await use("@/server");







if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
