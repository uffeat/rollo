/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
import "@/iworker";
/* Set up routes */
import "@/router";

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
