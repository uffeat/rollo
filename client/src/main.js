/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/anvil";
import "@/router";

import { server } from "@/server";

await (async () => {
  const result = await server.echo(42);
  console.log("result:", result);
})();

await (async () => {
  const result = await server.echo(43);
  console.log("result:", result);
})();

await (async () => {
  const result = await server.foo();
  console.log("result:", result);
})();

await (async () => {
  const result = await server.bar({bar: 'BAR'});
  console.log("result:", result);
})();



if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
