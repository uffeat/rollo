/*
/use/public/js.js
*/

const { component } = await use("@/component.js");

export default async () => {
  console.log("foo:", (await use("/test/foo.js")).foo);

  await use("/test/ding.js", { as: "script" });
  console.log("ding:", ding);

  console.log("dong:", await use("/test/dong.js", { as: "function" }));
};
