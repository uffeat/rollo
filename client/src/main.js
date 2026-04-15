/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  await import("@/dev.css");
}

await use("@/iworker/");

//
//
await (async () => {
  const result = await use(
    "@@/echo/",
    { test: false },
    { foo: "FOO", things: [{ a: 1 }, { b: 2 }] },
    { first: "FIRST" },
    10,
    20,
    30,
    { last: "LAST" },
  );
  console.log("@@/echo/ result:", result);
})();

await (async () => {
  const result = await use("@@/foo/", {
    visible: true,
    test: false,
  });
})();

await (async () => {
  const result = await use(
    "@@/plot/",
    {
      visible: true,
      test: false,
    },
    {},
    {
      Bar: {
        name: "Wonder Land",
        x: [2019, 2020, 2021, 2022, 2023],
        y: [510, 620, 687, 745, 881],
      },
    },
  );
})();

await (async () => {
  const result = await use(
    "rpc/echo/",
    { test: false },
    { foo: "FOO", things: [{ a: 1 }, { b: 2 }] },
    { first: "FIRST" },
    10,
    20,
    30,
    { last: "LAST" },
  );
  console.log("rpc/echo/ result:", result);
})();

await (async () => {
  const result = await use("@@/login/", {
    visible: "popover",
    test: false,
  });
  console.log("login result:", result);
})();
//
//

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
