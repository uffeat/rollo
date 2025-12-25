/* Initialize import engine and load main sheet (with Tailwind) */
import "@/main.css";
import "@/use";

import "@/router";

import { api, rpc } from "@/server";

const { app, Sheet, component, element, css, typeName } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const deepAssign = (target, source) => {
  for (const [key, value] of Object.entries(source)) {
    // Remove property if value is undefined
    if (value === undefined) {
      delete target[key];
      continue;
    }
    // Deep merge if both target and source values are plain objects
    if (
      typeName(value) === 'Object' && 
      typeName(target[key]) === 'Object'
    ) {
      deepAssign(target[key], value);
    } else {
      // Otherwise, directly assign (overwrite)
      target[key] = value;
    }
  }
  return target;
};

const target = {
  ding: true,
  stuff: 8,
  foo: { bar: "BAR" },
  things: false,
};

const source = {
  stuff: 4,
  foo: { dong: "dong" },
  other: 42,
  things: undefined,
};

deepAssign(target, source);

console.log(target)
/* target is now:
{
  ding: true,
  stuff: 4,
  foo: { bar: "BAR", dong: "dong" },
};
*/



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
