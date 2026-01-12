/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/router";
//import { server } from "@/server";


if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
