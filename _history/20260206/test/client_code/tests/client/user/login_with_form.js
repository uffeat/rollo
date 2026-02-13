/*
client/user/login_with_form.js
*/

export default async () => {

  const logout = await use("@@/user:logout");
  await logout()
  
  const login_with_form = await use("@@/user:login_with_form");

  const result = await login_with_form({allow_cancel: true})
  console.log('result:', result)

  
};
