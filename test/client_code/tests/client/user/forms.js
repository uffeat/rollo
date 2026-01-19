/*
client/user/forms.js
*/

const { InputFile, app, component, is, css, ref } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const delete_with_form = await use("@@/user:delete_with_form");
const get_user = await use("@@/user:get_user");
const login_with_form = await use("@@/user:login_with_form");
const logout_with_form = await use("@@/user:logout_with_form");
const signup_with_form = await use("@@/user:signup_with_form");

export default async () => {
  css`
    frame-component nav[slot="top"] a {
      cursor: pointer;
    }
  `.use();

  const LINK_STYLE = "nav-link link-light";
  const D_NONE = "d-none";

  const signup = component.a(
    LINK_STYLE,
    { title: "Sign up", _action: "signup" },
    "Sign up",
  );

  const login = component.a(
    LINK_STYLE,
    { title: "Log in", _action: "login" },
    "Log in",
  );

  const delete_user = component.a(
    LINK_STYLE,
    //`${LINK_STYLE} ${D_NONE}`,
    { title: "Delete account", _action: "delete" },
    "Delete account",
  );

  const logout = component.a(
    LINK_STYLE,
    //`${LINK_STYLE} ${D_NONE}`,
    { title: "Log out", _action: "logout" },
    "Log out",
  );

  const state = ref();

  state.effects.add(
    (current) => {
      console.log("current:", current); ////
      return//

      if (current) {
        login.classes.add(D_NONE);
        signup.classes.add(D_NONE);
        logout.classes.remove(D_NONE);
        delete_user.classes.remove(D_NONE);
      } else if (current === null) {
        login.classes.remove(D_NONE);
        signup.classes.remove(D_NONE);
        logout.classes.add(D_NONE);
        delete_user.classes.add(D_NONE);
      }
    },
    { run: false },
  );


  const user = await get_user()
  console.log("user:", user); ////



  const nav = component.nav(
    "nav",
    { parent: frame, slot: "top" },
    signup,
    login,
    delete_user,
    logout,
  );

  nav.on.click(async (event) => {
    const action = event.target._action;
    if (!action) {
      return;
    }
    event.preventDefault();

    if (action === "login") {
      const result = await login_with_form();
      console.log("result:", result); ////
      //state(result);////
      return;
    }

    if (action === "logout") {
      const result = await logout_with_form();
      console.log("result:", result); ////
      //state(null);////
      return;
    }

    if (action === "signup") {
      const result = await signup_with_form();
      console.log("result:", result); ////
      //state(result);////
      return;
    }

    if (action === "delete") {
      const result = await delete_with_form();
      console.log("result:", result); ////
      //state(result);////
      return;
    }
  });
};
