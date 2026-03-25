/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  //await import("@/dev.css");
}




//const { user } = await use("@/user/");

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
