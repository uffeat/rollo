import "../use";

const { Ref, component } = await use("@/rollo/");
const { frame } = await use("@/frame/");
const { server } = await use("@/server");
const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");

export const user = new (class User {
  #_ = {
    state: Ref.create(null),
  };

  constructor() {}

  get data() {
    return this.#_.state.current;
  }

  get effects() {
    return this.#_.state.effects;
  }

  async Login() {
    return await this.#_.Login();
  }

  async Logout() {
    return await this.#_.Logout();
  }

  async login(email, password) {
    return await this.#_.login(email, password);
  }

  async get() {
    return await this.#_.get();
  }

  async logout() {
    return await this.#_.logout();
  }

  async setup({
    Login,
    Logout,
    Signup,
    change,
    get,
    login,
    logout,
    reset,
    signup,
  } = {}) {
    if (Login) {
      this.#_.Login = async () => {
        const data = await Login();
        //console.log("data:", data); ////
        if (data) {
          this.#_.state.update(data);
        }
        return data;
      };
    }

    if (Logout) {
      this.#_.Logout = async () => {
        const result = await Logout();
        if (result) {
          this.#_.state.update(null);
        }
        return result;
      };
    }

    if (get) {
      this.#_.get = async () => {
        const data = await get();
        this.#_.state.update(data || null);
        return data;
      };
      await this.get();
    }

    if (login) {
      this.#_.login = async (email, password) => {
        const data = await login(email, password);
        if (data.error) {
          this.#_.state.update(null);
        } else {
          this.#_.state.update(data);
        }
        return data;
      };
    }

    if (logout) {
      this.#_.logout = async () => {
        const result = await logout();
        this.#_.state.update(null);
        return result;
      };
    }
  }
})();

if (use.meta.ANVIL) {
  localStorage.removeItem("user");
} else {
  await user.setup({
    Login: async () => {
      const form = Form(
        `flex flex-col gap-y-3 py-1`,
        {},
        Input({
          type: "email",
          label: "Email",
          name: "email",
          required: true,
        }),
        Input({
          type: "password",
          name: "password",
          label: "Password",
          required: true,
        }),
      );

      const message = component.p({parent: form});

      const submit = component.button(".btn.btn-primary", {
        text: "Submit",
        disabled: true,
      });

      form.$.effects.add(
        ({ valid }, message) => {
          submit.disabled = !valid;
        },
        ["valid"],
      );

      const content = (host) => {
        submit.on.click(async (event) => {
          const valid = form.valid;
          if (valid) {
            const { email, password } = form.data;
            // TODO spinner
            const data = await user.login(email, password);
            //console.log("data:", data); ////

            

            if (data.error) {
              console.log("error:", data.error); ////
              //message.text = data.error


            } else {
              //message.text = null
              host.close(data);
            }
          } else {
            // TODO Message
          }
        });
        return form;
      };
      const result = await modal({ content, title: "Log in" }, submit);
      return result;
    },
    Logout: async () => {
      const content = (host) => {
        host.tree.footer.on.click(async (event) => {
          if (event.target?.tagName !== "BUTTON") {
            return;
          }
          if (event.target.attribute.logout) {
            const result = await user.logout();
            host.close(result);
          } else {
            host.close();
          }
        });
        return component.p({
          text: "Do you wish to log out?",
        });
      };

      const confirmed = await modal(
        { content, title: "Log out" },
        component.button(".btn.btn-primary", {
          text: "Yes",
          "[logout]": true,
        }),
        component.button(".btn.btn-secondary", {
          text: "No",
        }),
      );
      //console.log("confirmed:", confirmed);////
      if (confirmed) {
        return await user.logout();
      }
    },

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
  });
}

const loginLink = component.a("nav-link cursor-pointer", {
  text: "Log in",
  $action: "login",
});

const logoutLink = component.a("nav-link cursor-pointer", {
  text: "Log out",
  $action: "logout",
});

// Setup nav
const nav = component.nav(
  "flex gap-3",
  { parent: frame, slot: "top" },
  loginLink,
  logoutLink,
);

nav.on.click(async (event) => {
  event.preventDefault();
  const action = event.target?.getAttribute("state-action");
  if (!action) {
    return;
  }

  if (action === "login") {
    const result = await user.Login();
    //console.log("result:", result);////
    return;
  }

  if (action === "logout") {
    await user.Logout();

    return;
  }
});

user.effects.add((current) => {
  //console.log("current:", current); ////
  if (current) {
    loginLink.classes.add("d-none");
    logoutLink.classes.remove("d-none");
  } else {
    loginLink.classes.remove("d-none");
    logoutLink.classes.add("d-none");
  }
});
