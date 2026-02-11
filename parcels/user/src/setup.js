import "../use";
import { user } from "./user";
import { Login, Logout, Reset, Signup } from "./modals";

const { app, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");

if (use.meta.ANVIL) {
  localStorage.removeItem("user");
} else {
  const { server } = await use("@/server");

  await user.setup({
    Login,
    Logout,
    Reset,
    Signup,
    get: () => {
      // Get stored user
      const data = Object.freeze(
        JSON.parse(localStorage.getItem("user") || null),
      );
      return data;
    },
    login: async (email, password) => {
      const { result } = await server.login(email, password);
      if (result.ok) {
        const data = { password, ...result.data };
        localStorage.setItem("user", JSON.stringify(data));
        return Object.freeze(data);
      } else {
        localStorage.removeItem("user");
        return { error: result.message };
      }
    },
    logout: async () => {
      await server.logout();
      localStorage.removeItem("user");
    },

    reset: async (email) => {
      const { result } = await server.send_password_reset_email(email);

      if (result.ok) {
        localStorage.removeItem("user");
        return {};
      } else {
        return { error: result.message };
      }
    },

    signup: async (email, password) => {
      const { result } = await server.signup(email, password);
      if (result.ok) {
        const data = { password, ...result.data };
        localStorage.setItem("user", JSON.stringify(data));
        return Object.freeze(data);
      } else {
        localStorage.removeItem("user");
        return { error: result.message };
      }
    },
  });
}

// Setup nav
const nav = component.nav(
  "flex gap-3",
  { parent: frame, slot: "top", "[user]": true },
  component.a("nav-link cursor-pointer", {
    text: "Log in",
    "[action]": "login",
  }),
  component.a("nav-link cursor-pointer", {
    text: "Sign up",
    "[action]": "signup",
  }),
  component.a("nav-link cursor-pointer", {
    text: "Log out",
    "[action]": "logout",
    "[user]": true,
  }),
);
nav.on.click(async (event) => {
  event.preventDefault();
  const action = event.target.attribute.action;
  if (!action) {
    return;
  }
  if (action === "login") {
    await user.Login();
    return;
  }
  if (action === "logout") {
    await user.Logout();
    return;
  }
  if (action === "signup") {
    await user.Signup();
    return;
  }
});

user.effects.add((current) => {
  app.$.user = current;
});
