/* 
/visual.test.js
*/

const { iworker } = await use("@/iworker/");

export default async () => {
  iworker.request("@@/echo/");

  iworker.show("@@/login/", { visible: "popover" }).then((result) => {
    console.log("@@/login/ result:", result);
  });

  iworker.show("@@/foo/").then((result) => {
    console.log("@@/foo/ result:", result);
  });

  iworker.request("@@/echo/");

  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });

  iworker.show("@@/foo/").then((result) => {
    console.log("@@/foo/ result:", result);
  });

  await iworker.request("@@/echo/");

  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });

  await iworker.show("@@/foo/");

  iworker.show("@@/stuff/", { visible: "popover" }).then((result) => {
    console.log("@@/stuff/ result:", result);
  });
};
