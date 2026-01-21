/*
user/custom_user.js
*/

export default async () => {
  const rpc = await use("@@/tools:rpc");
  const login_with_form = await use("@@/user:login_with_form");
  const logout_with_form = await use("@@/user:logout_with_form");
  const signup_with_form = await use("@@/user:signup_with_form");

  await (async () => {
    const result = await logout_with_form();
    console.log("result:", result);
  })();

  await (async () => {
    const result = await login_with_form();
    console.log("result:", result);
  })();

  await (async () => {
    //const result = await signup_with_form();
    //console.log("result:", result);
  })();
};


//uffeat@gmail.com