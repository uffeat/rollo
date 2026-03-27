/* 
/basics.test.js
*/


const { iworker } = await use("@/iworker/");

export default async () => {

    
  iworker
    .request(
      "rpc/echo",
      { test: true },
      { foo: "FOO", things: [{ first: 1 }, { second: 2 }] },
      10,
      20,
      30,
      {last: 'LAST'}
    )
    .then((result) => {
      console.log("rpc/echo result:", result); ////
    });

   iworker
    .request(
      "api/echo",
      { test: true },
      { foo: "FOO", things: [{ first: 1 }, { second: 2 }] },
      10,
      20,
      30,
      {last: 'LAST'}
    )
    .then((result) => {
      console.log("api/echo result:", result); ////
    });

  iworker
    .request(
      "rpc/echo"
    )
    .then((result) => {
      console.log("rpc/echo result:", result); ////
    });

  iworker
    .request(
      "api/echo"
    )
    .then((result) => {
      console.log("api/echo result:", result); ////
    });
    



  iworker
    .request(
      "@@/echo/",
      { test: true },
      { foo: "FOO", things: [{ first: 1 }, { second: 2 }] },
      10,
      20,
      30,
    )
    .then((result) => {
      console.log("@@/echo/ result:", result); ////
    });

  iworker.show("@@/login/", { visible: "popover" }).then((result) => {
    console.log("@@/login/ result:", result);
  });

  iworker.show("@@/foo/").then((result) => {
    console.log("@@/foo/ result:", result);
  });

  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });

  iworker.show("@@/foo/").then((result) => {
    console.log("@@/foo/ result:", result);
  });

  iworker
    .request("@@/echo/", { test: true }, { foo: "FOO" }, 10, 20, 30)
    .then((result) => {
      console.log("@@/echo/ result:", result); ////
    });

  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });

  iworker.show("@@/foo/").then((result) => {
    console.log("@@/foo/ result:", result);
  });

  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });




 
};
