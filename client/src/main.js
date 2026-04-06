/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  await import("@/dev.css");
}

await use("@/iworker/");

await (async () => {
    const result = await use(
      "rpc/echo/",
      { test: true },
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
  const result = await use(
    "@@/login/",
    {
      visible: "popover",
      test: true,
    },
  );
  console.log("login result:", result);
})();

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
