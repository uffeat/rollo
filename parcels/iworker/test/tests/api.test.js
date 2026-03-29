/* 
/api.test.js
*/

const { iworker } = await use("@/iworker/");

export default async () => {
  iworker
    .request(
      "api/echo",
      { test: true },
      { foo: "FOO", things: [{ a: 1 }, { a: 2 }] },
      { first: "FIRST" },
      10,
      20,
      30,
      { last: "LAST" },
    )
    .then((result) => {
      console.log("api/echo result:", result); ////
    });

  
};
