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

await (async () => {
  const { server } = await use("@/server");
  const {response, result, meta} = await server.echo(42);
  //console.log("result:", result);
  console.log("meta:", meta);
})();

await (async () => {
  const { server } = await use("@/server");
  const {response, result, meta} = await server.echo(42);
  //console.log("result:", result);
  console.log("meta:", meta);
  
})();

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
