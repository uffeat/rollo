/*
use/public/test.js
*/

const { component } = await use("@/component.js");

export default async () => {
  const { component } = await use("@/component.js");
  const container = component.div({ parent: document.body });

  await use("/test/foo.css", { as: "link" });

  await use("/test/bar.css", document);

  container.insert.beforeend(await use("/test/foo.template"));

  console.log("foo:", (await use("/test/foo.js")).foo);
  console.log("foo:", (await use("/test/foo.json")).foo);

  await use("/test/ding.js", { as: "script" });
  console.log("ding:", ding);

  console.log("dong:", await use("/test/dong.js", { as: "function" }));
};
