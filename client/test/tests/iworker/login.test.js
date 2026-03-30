/* 
/iworker/login.test.js
*/

await use("@/iworker/");

export default async () => {
   await (async () => {
    const result = await use("@@/login/", { visible: "popover" });
    console.log("@@/login/ result:", result);
  })();
};
