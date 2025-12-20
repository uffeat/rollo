/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";
import "@/router";

import { api, rpc } from "@/server";

//console.log("foo:", await use(`@/test/foo.template`, { convert: true }));

//console.log("astract:", await use(`/content/blog/abstract.md`));
//console.log("astract:", await use(`/content/blog/abstract.md`));

const meta = document.head.querySelector(`meta[plotly]`)
//console.log("meta:", meta);////
const encoded = meta.getAttribute('plotly')

const decoded = atob(encoded)
//console.log("decoded:", decoded);////
const mod = await use.module(decoded)
//console.log("mod:", mod);////
const { Plotly } = mod;


//const { Plotly } = await use("/parcels/plotly/");
console.log("Plotly:", Plotly);

await (async () => {
  const { data, meta } = await api.echo({ ding: 42, dong: true, foo: "FOO" });
  console.log("data:", data);
  console.log("meta:", meta);
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
