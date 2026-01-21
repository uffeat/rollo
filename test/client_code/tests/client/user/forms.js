/*
client/user/forms.js
*/

const { InputFile, app, component, is, css, ref } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const configure_account_with_form = await use(
  "@@/user:configure_account_with_form",
);
const delete_with_form = await use("@@/user:delete_with_form");
const get_user = await use("@@/user:get_user");
const login_with_form = await use("@@/user:login_with_form");
const logout_with_form = await use("@@/user:logout_with_form");
const reset_with_form = await use("@@/user:reset_with_form");
const signup_with_form = await use("@@/user:signup_with_form");


export default async () => {

  await (async () => {
    const result = await get_user();
    console.log("result:", result);
  })();

  await (async () => {
    const result = await logout_with_form();
    console.log("result:", result);
  })();

  await (async () => {
    const result = await login_with_form();
    console.log("result:", result);
  })();

  await (async () => {
    const result = await login_with_form();
    console.log("result:", result);
  })();

  await (async () => {
    const result = await reset_with_form();
    console.log("result:", result);
  })();

  
 
};


//uffeat@gmail.com