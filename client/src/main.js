/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

const { InputFile, app, component, is, css, ref } = await use("@/rollo/");
const { frame } = await use("@/frame/");

//
//
component.button("btn.btn-primary", { text: "Primary", parent: frame });
component.button("btn.btn-secondary", { text: "Secondary", parent: frame });
component.a( { text: "Link", parent: frame });
component.input('form-control', {parent: frame });

//
//

await (async () => {
  // TODO Wrap in 'user' util

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
    "Sign up"
  );

  const login = component.a(
    LINK_STYLE,
    { title: "Log in", _action: "login" },
    "Log in"
  );

  const delete_user = component.a(
    `${LINK_STYLE} ${D_NONE}`,
    { title: "Log in", _action: "delete_user" },
    "Delete account"
  );

  const logout = component.a(
    `${LINK_STYLE} ${D_NONE}`,
    { title: "Log out", _action: "logout" },
    "Log out"
  );

  iworker.receiver.effects.add(
    ({ user }) => {
      console.log("user:", user);
      if (user) {
        login.classes.add(D_NONE);
        signup.classes.add(D_NONE);
        logout.classes.remove(D_NONE);
        delete_user.classes.remove(D_NONE);
      } else {
        login.classes.remove(D_NONE);
        signup.classes.remove(D_NONE);
        logout.classes.add(D_NONE);
        delete_user.classes.add(D_NONE);
      }
    },
    ["user"]
  );

  const processing = ref(false);
  processing.effects.add(
    (current) => {
      console.log("current:", current);
    },
    { run: false }
  );

  const nav = component.nav(
    "nav",
    { parent: frame, slot: "top" },
    signup,
    login,
    delete_user,
    logout
  );

  nav.on.click(async (event) => {
    const action = event.target._action;
    if (!action) {
      return;
    }
    event.preventDefault();

    if (action === "login") {
      const result = await iworker[`user:${action}`]({
        email: "uffeat@gmail.com",
        password: "f8",
      });
      const { ok, user, message } = result;
      if (ok) {
        //console.log("Logged in as:", user); ////
      } else {
        console.warn(message);
      }
      return;
    }

    if (action === "logout") {
      const result = await iworker[`user:${action}`]();
      const { ok, message } = result;
      if (ok) {
        //console.log("Logged out"); ////
      } else {
        console.warn(message); ////
      }
      return;
    }

    if (action === "signup") {
      const result = await iworker[`user:${action}`]({
        email: "uffeat@gmail.com",
        password: "f8",
      });
      const { ok, user, message } = result;
      if (ok) {
        //console.log("Signed up as:", user); ////
      } else {
        console.warn(message); ////
      }
      return;
    }

    if (action === "delete_user") {
      const { result } = await iworker[`user:${action}`]();
      const { ok } = result;
      if (ok) {
        //console.log("Account deleted");////
      } else {
        console.warn("Account not found");
      }
      return;
    }
  });
})();

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
