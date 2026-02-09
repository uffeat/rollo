/* 
/basics.test.js
*/

const { Exception, match } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { server } = await use("@/server");

const getUser = async () => {
  return Object.freeze(JSON.parse(localStorage.getItem("user") || null));
};

const login = async (email, password) => {
  const { result } = await server.login(email, password);
  localStorage.setItem("user", JSON.stringify(result));
  return Object.freeze(result);
};

export default async () => {
  frame.clear(":not([slot])");

  await (async () => {
    console.log("user:", await getUser());
  })();

  await (async () => {
    //const user = await login("uffeat@gmail.com", "f");
    console.log("user:", await login("uffeat@gmail.com", "f"));
  })();
};
