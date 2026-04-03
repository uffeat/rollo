/* 
/iworker/stuff.test.js
*/

await use("@/iworker/");

export default async () => {
   await (async () => {
    const result = await use("@@/stuff/", { visible: "popover" });
    console.log("@@/stuff/ result:", result);
  })();
};
