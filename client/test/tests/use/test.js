/*
use/test.js
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

    border: "2px solid green",
  });

  await (async () => {
    console.log("foo:", (await use("/test/foo.js")).foo);
    console.log("foo:", (await use("/test/foo.json")).foo);

    (await use("/test/foo.x.template"))({ parent: container });
  })();

  await (async () => {
    console.log("foo:", (await import("../../../../assets/test/foo.js")).foo);
    console.log("foo:", (await use("@/test/foo.js")).foo);

    console.log("foo:", (await use("@/test/foo.json")).foo);

    (await use("@/test/foo.x.template"))({ parent: container });
  })();

  await (async () => {
    console.log("foo:", (await use("@@/test/foo.js")).foo); ////
    console.log("foo:", (await use("@@/test/foo.json")).foo); ////
  })();
};
