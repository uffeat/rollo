/* 
/rpc.test.js
*/

const { iworker } = await use("@/iworker/");

export default async () => {
  iworker
    .request(
      "rpc/echo",
      { test: true },
      { foo: "FOO", things: [{ a: 1 }, { b: 2 }] },
      { first: "FIRST" },
      10,
      20,
      30,
      { last: "LAST" },
    )
    .then((result) => {
      console.log("rpc/echo result:", result); ////
    });






};
