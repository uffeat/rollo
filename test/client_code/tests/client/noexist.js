/*
client/noexist.js
*/

export default async () => {
  await (async () => {
    try {
      const noexist = await use("@@/noexist/");
      const result = await noexist();
      console.log("result:", result);
    } catch (error) {
      console.warn(error);
    }
  })();
};
