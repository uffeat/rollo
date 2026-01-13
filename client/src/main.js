/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
import { iworker } from "@/iworker";
/* Set up routes */
import "@/router";
import { server } from "@/server";

const { InputFile, app, component, is, css, ref } = await use("@/rollo/");
const { frame } = await use("@/frame/");

await (async () => {
  // TODO Wrap in 'user' util

  css`
    frame-component nav[slot="top"] a {
      cursor: pointer;
    }
  `.use();

  const signup = component.a(
    "nav-link link-light",
    { title: "Sign up", _action: "signup" },
    "Sign up"
  );

  const login = component.a(
    "nav-link link-light",
    { title: "Log in", _action: "login" },
    "Log in"
  );

  const delete_user = component.a(
    "nav-link link-light d-none",
    { title: "Log in", _action: "delete_user" },
    "Delete account"
  );

  const logout = component.a(
    "nav-link link-light d-none",
    { title: "Log out", _action: "logout" },
    "Log out"
  );

  iworker.receiver.effects.add(
    ({ user }) => {
      console.log("user:", user);
      if (user) {
        login.classes.add('d-none')
        signup.classes.add('d-none')
        logout.classes.remove('d-none')
        delete_user.classes.remove('d-none')
      } else {
        login.classes.remove('d-none')
        signup.classes.remove('d-none')
        logout.classes.add('d-none')
        delete_user.classes.add('d-none')
        
      }
    },
    ["user"]
  );

  const processing = ref(false)
  processing.effects.add((current)=> {
    console.log("current:", current);

  }, {run: false})

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
        console.log("Logged in as:", user);////
      } else {
        console.warn(message);
      }
      return
    }

    if (action === "logout") {
      const result = await iworker[`user:${action}`]();
      const { ok, message } = result;
      if (ok) {
        console.log("Logged out");////
      } else {
        console.warn(message);////
      }
      return
    }

    if (action === "signup") {
      const result = await iworker[`user:${action}`]({
        email: "uffeat@gmail.com",
        password: "f8",
      });
      const { ok, user, message } = result;
      if (ok) {
        console.log("Signed up as:", user);////
      } else {
        console.warn(message);////
      }
      return
    }

    if (action === "delete_user") {
      const result = await iworker[`user:${action}`]();

      console.log("result:", result);////

      /*
      const { ok, message } = result;
      if (ok) {
        console.log("Account deleted");
      } else {
        console.warn(message);
      }
        */
      return
    }
  });
})();

if (import.meta.env.DEV) {
  /* Initialize DEV testbench */
  await import("../test");
}
