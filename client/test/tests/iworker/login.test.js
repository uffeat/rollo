/* 
/iworker/login.test.js
*/

await use("@/iworker/");

export default async () => {
   await (async () => {
    const result = await use("@@/login/", { 
      visible: "popover", 
      test: true,
    });
    console.log("login result:", result);
  })();
};
