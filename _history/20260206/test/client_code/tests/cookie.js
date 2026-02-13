/*
cookie.js
*/

export default async () => {
  await (async () => {
    const cookie = await use("rpc/cookie", { spinner: true });
    const { result, meta } = await cookie();
    console.log("result:", result);
    console.log("meta:", meta);
  })();

  await (async () => {
    const { server } = await use("@/server");
    const { result, meta } = await server.cookie();
    console.log("result:", result);
    console.log("meta:", meta);
  })();
};
