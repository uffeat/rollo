/*
client/bad.js
*/

export default async () => {
  await (async () => {
    try {
      const bad = await use("@@/bad/");
      const result = await bad();
      console.log("result:", result);
    } catch (error) {
      console.warn(error);
    }
  })();
};
