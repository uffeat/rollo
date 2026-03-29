/* 
/packages.test.js
*/

const { iworker } = await use("@/iworker/");

export default async () => {
  iworker
    .request(
      "@@/echo/",
      { test: true },
      { foo: "FOO", things: [{ a: 1 }, { b: 2 }] },
      { first: "FIRST" },
      10,
      20,
      30,
      { last: "LAST" },
    )
    .then((result) => {
      console.log("@@/echo/ result:", result); ////
    });

  iworker
    .request(
      "@@/echo/",
      { foo: "FOO", things: [{ a: 1 }, { b: 2 }] },
      { first: "FIRST" },
      10,
      20,
      30,
      { last: "LAST" },
    )
    .then((result) => {
      console.log("@@/echo/ result:", result); ////
    });

  iworker
    .request("@@/echo/", {}, {}, { first: "FIRST" }, 10, 20, 30, {
      last: "LAST",
    })
    .then((result) => {
      console.log("@@/echo/ result:", result); ////
    });
};
