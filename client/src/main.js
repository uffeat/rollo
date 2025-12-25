/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";

import "@/router";

import { api, rpc } from "@/server";

const { app, Sheet, component, element, css, typeName } = await use("@/rollo/");
const { frame } = await use("@/frame/");




await (async () => {
  //const { data, meta } = await api.echo({ ding: 42, dong: true, foo: "FOO" });
  //console.log("data:", data);
  //console.log("meta:", meta);
})();

/*
await (async () => {
  const { data, meta } = await rpc.echo({ ding: 42, dong: true, foo: "FOO" });
  console.log("data:", data);
  console.log("meta:", meta);
})();
*/

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
