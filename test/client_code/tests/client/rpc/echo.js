/*
client/rpc/echo.js
*/

export default async () => {
  await (async () => {
    const echo = await use("rpc/echo");
    const response = await echo({ foo: 420 }, 10, 20, 30);
    console.log("response:", response);
  })();

  await (async () => {
    
  })();

  

};
