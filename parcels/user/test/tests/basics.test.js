/* 
/basics.test.js
*/

const { Ref, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { server } = await use("@/server");
const { user } = await use("@/user/");

export default async () => {
  frame.clear(":not([slot])");

  

  await (async () => {
    //console.log("user.data:", user.data);
  })();

  await (async () => {
    //const result = await Login();
    //console.log("result:", result);
  })();

  await (async () => {
    //const data = await user.login("uffeat@gmail.com", "f");
    //console.log("user.data:", user.data);
    //console.log("user:", await login("uffeat@gmail.com", "f"));
  })();
};

//uffeat@gmail.com
