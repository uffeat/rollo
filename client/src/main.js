/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/anvil";
import "@/router";

import { api } from "@/server";

const result = await api.echo(42)
console.log('result:', result)

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
