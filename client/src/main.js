/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  await import("@/dev.css");
}

await use('@/iworker/');



if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
