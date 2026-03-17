/*
/use/convert.test.js
*/

const { frame } = await use("@/frame/");

export default async () => {
  console.log("foo:", await use(`@/test/foo.template`, { convert: true }));
};