/* 
/echo.test.js
*/

const { server } = await use("@/server");

export default async () => {
  const { response, result, meta } = await server.echo(
    { test: true },
    { random: crypto.randomUUID() },
    1,
    2,
    3,
  );
  console.log("response:", response);
  console.log("result:", result);
  console.log("meta:", meta);
};
