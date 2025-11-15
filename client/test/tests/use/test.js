/*
use/test.js

Tests import of js, json and x.template assets from
- public
- assets
- src/assets
*/
const { Sheet, css, scope } = await use("@/sheet.js");
const { component } = await use("@/component.js");
const { layout } = await use("@//layout.js");

export default async () => {
  layout.clear(":not([slot])");

  const container = component.main("container.mt-3", {
    parent: layout,

    ...css.display.flex,
    ...css.flexDirection.column,
    ...css.alignItems.end,

    border: "2px solid blue",
  });

  /* Import from public (always live) */
  await (async () => {
    console.log("foo:", (await use("/test/foo.js")).foo);
    console.log("foo:", (await use("/test/foo.json")).foo);
    (await use("/test/foo.x.template"))({ parent: container });
  })();

  /* Import from assets (out-of-the-box NOT live, but can be made live) */
  await (async () => {
    /* js */
    /** Built */
    //console.log("foo:", (await use("@/test/foo.js")).foo);
    /** Unbuilt - for live testing */
    console.log("foo:", (await import("../../../assets/test/foo.js")).foo);
    /* json */
    /** Built */
    //console.log("foo:", (await use("@/test/foo.json")).foo);
    /** Unbuilt - for live testing */
    console.log("foo:", (await import("../../../assets/test/foo.json")).foo);
    /** Alternatively
    use.assets.add(
      "@/test/foo.json",
      (await import("../../../assets/test/foo.json?raw")).default
    );
    console.log("foo:", (await use("@/test/foo.json")).foo);
    */
    /* x.template */
    /** Built */
    //(await use("@/test/foo.x.template"))({ parent: container });
    /** Unbuilt - for live testing */
    use.assets.add(
      "@/test/foo.x.template",
      (await import("../../../assets/test/foo.x.template?raw")).default
    );
    (await use("@/test/foo.x.template"))({ parent: container });
  })();

  /* Import from src/assets (always live) */
  await (async () => {
    console.log("foo:", (await use("@@/test/foo.js")).foo);
    console.log("foo:", (await use("@@/test/foo.json")).foo);
    (await use("@@/test/foo.x.template"))({ parent: container });
  })();
};
