/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/router";
//import { server } from "@/server";

window.addEventListener("message", async (event) => {
  if (event.origin !== use.meta.companion.origin) {
    return;
  }
  console.log('event.data:', event.data)
});

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
