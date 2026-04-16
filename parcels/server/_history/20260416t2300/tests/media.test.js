/* 
/media.test.js
*/

const { Server, server } = await use("@/server");

export default async () => {
  // Using 'server'
  await (async () => {
    const media = server.media({ encode: "bytes", test: true, foo: 42 });
    const { content, type, name } = await media({}, "handle");
    console.log("content:", content);
    console.log("type", type);
    console.log("name", name);
  })();
  // Using 'use'
  await (async () => {
    const media = await use("server/media", { encode: "bytes", test: true });
    const { content, type, name } = await media({}, "handle");
    console.log("content:", content);
    console.log("type", type);
    console.log("name", name);
  })();
  // Using 'Server'
  await (async () => {
    const media = Server.call("media")({ encode: "bytes", test: true });
    const { content, type, name } = await media({}, "handle");
    console.log("content:", content);
    console.log("type", type);
    console.log("name", name);
  })();
};
