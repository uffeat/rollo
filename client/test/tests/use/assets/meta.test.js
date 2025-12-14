/*
/use/assets/meta.test.js
*/

const { frame } = await use("@/frame/");

export default async () => {
  frame.clear(":not([slot])");
  console.log("@-paths:", await use("@/__paths__.json"));
};
