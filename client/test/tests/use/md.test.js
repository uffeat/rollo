/*
/use/md.test.js
*/

const { frame } = await use("@/frame/");

export default async () => {
  console.log("astract:", await use(`/content/blog/abstract.md`));
};