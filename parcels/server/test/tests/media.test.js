/* 
/media.test.js
*/

const { server } = await use("@/server");

export default async () => {
  await (async () => {
    const media = await use("server/media", {
      encode: "bytes",
      test: true,
    });
    //console.log("media:", media);

    const response = await media({}, "handle");

    console.log("response:", response);
  })();

  await (async () => {
    const { content, type, name } = await server.media({
      encode: "bytes",
      test: true,
    })({}, "handle");
    console.log("content:", content);
    console.log("type", type);
    console.log("name", name);
  })();
};
