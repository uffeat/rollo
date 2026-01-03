/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";

const { Exception, app, Sheet, component, element, css, typeName, is } =
  await use("@/rollo/");
const { frame } = await use("@/frame/");

if (import.meta.env.DEV) {
  

  /* Initialize DEV testbench */
  await import("../test");
}
