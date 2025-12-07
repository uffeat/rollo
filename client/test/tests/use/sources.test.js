/*
/use/sources.test.js

Tests import of js, json and x.template assets from
- public
- assets
- src/assets
*/
const { Sheet, css, scope } = await use("@/sheet");
const { component } = await use("@/component");
const { layout } = await use("@/layout/");

export default async () => {
  layout.clear(":not([slot])");

  const container = component.main("container.mt-3", {
    parent: layout,
    ...css.display.flex,
    ...css.flexDirection.column,
    ...css.alignItems.end,
  });

  /* Import from public (always live) */
  await (async () => {
    console.log("foo:", (await use("/test/foo.js")).foo);
    console.log("foo:", (await use("/test/foo.json")).foo);
    const element = (await use("/test/foo.x.template"))();
    container.append(element)
  })();

  /* Import from assets (out-of-the-box NOT live, but can be made live) */
  await (async () => {
    /** js */
    /* Unbuilt - for live testing */
    console.log("foo:", (await import("../../../assets/test/foo.js")).foo);
    /** json */
    /* Unbuilt - for live testing */
    console.log("foo:", (await import("../../../assets/test/foo.json")).foo);
    /** x.html */
    /* Unbuilt - for live testing */
    use.add(
      "@/test/foo.x.html",
      (await import("../../../assets/test/foo.x.html?raw")).default
    );
    const element = (await use("@/test/foo.x.html"))();
    container.append(element)
  })();

  /* Import from src/assets (always live) */
  await (async () => {
    console.log("foo:", (await use("@@/test/foo.js")).foo);
    console.log("foo:", (await use("@@/test/foo.json")).foo);
    const element = (await use("@@/test/foo.x.html"))();
    container.append(element)
   
  })();
};
