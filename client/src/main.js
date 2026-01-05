/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import { anvil } from "@/anvil";
import "@/router";

/* Test */
await (async () => {
  const result = await anvil.echo(42);
  console.log("result:", result);
})();

await (async () => {
  const result = await anvil.echo("foo");
  console.log("result:", result);
})();

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
