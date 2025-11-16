/*
use/public/json.js
*/

const { component } = await use("@/component.js");

export default async () => {
 
  console.log("foo:", (await use("/test/foo.json")).foo);


};
