/*
user/forms.js
*/

export default async () => {
  const delete_with_form = await use("@@/user:delete_with_form");
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