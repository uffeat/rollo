/*
/tools/is/promise.test.js
*/

const { frame } = await use("@/frame/");
const { is } = await use("@/rollo/");

export default async () => {
  frame.clear(":not([slot])");

  const { promise } = Promise.withResolvers();

  const result = is.Promise(promise);
  console.log("result:", result);
};
