/* 
/iworker/login.test.js
*/

await use("@/iworker/");

export default async () => {
  await (async () => {
    const result = await use(
      "@@/login/",
      {
        visible: "popover",
        test: true,
      },
      { foo: "FOO", things: [{ a: 1 }, { b: 2 }] },
      { first: "FIRST" },
      10,
      20,
      30,
      { last: "LAST" },
    );
    console.log("login result:", result);
  })();
};
