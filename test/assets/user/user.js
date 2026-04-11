const { Ref, component } = await use("@/rollo/");

const getUser = await use("@@/user:get_user");
const _Login = await use("@@/user:Login");
const _Logout = await use("@@/user:Logout");
const _Signup = await use("@@/user:Signup");

const user = Ref.create();


const Logout = async () => {
  const result = await _Logout();
  if (result) {
    console.log("Setting user state to:", null);
    user.update(null);
  }
};

const Login = async () => {
  const result = await _Login();
  console.log("Setting user state to:", result);
  user.update(result);
};

const Signup = async () => {
  const result = await _Signup();
  console.log("Setting user state to:", result);
  user.update(result);
};

export { Logout, Login, Signup, user };
