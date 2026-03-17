/* Initialize import engine */
import "@/main.css";
import "@/use";
/* Initialize iworker */
//import { iworker } from "@/iworker";
/* Set up routes */
import "@/routes";

if (import.meta.env.DEV) {
  //await use("/parcels/main/main.css");
  await import("@/dev.css");
}

//const { user } = await use("@/user/");

const { Ref, app, component, css } = await use("@/rollo/");
const { frame } = await use("@/frame/");

const { Form, Input } = await use("@/form/");
const { modal } = await use("@/modal/");
const { Spinner } = await use("/tools/spinner");
const { Alert } = await use("/tools/alert");

const user = new (class {
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
    if (!this.#_.Login) {
      return;
    }
    return await this.#_.Login();
  }

  async Logout() {
    return await this.#_.Logout();
  }

  async Reset() {
    return await this.#_.Reset();
  }

  async Signup() {
    return await this.#_.Signup();
  }

  async get() {
    return await this.#_.get();
  }

  async login(email, password) {
    return await this.#_.login(email, password);
  }

  async logout() {
    return await this.#_.logout();
  }

  async reset(email) {
    return await this.#_.reset(email);
  }

  async signup(email, password) {
    return await this.#_.signup(email, password);
  }

  async setup({
    Login,
    Logout,
    Reset,
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

    if (Reset) {
      this.#_.Reset = async () => {
        const confirmed = await Reset();
        //console.log("data:", data); ////
        if (confirmed) {
          this.#_.state.update(null);
        }
        return confirmed;
      };
    }

    if (Signup) {
      this.#_.Signup = async () => {
        const data = await Signup();
        //console.log("data:", data); ////
        if (data) {
          this.#_.state.update(data);
        }
        return data;
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

    if (reset) {
      this.#_.reset = async (email) => {
        const result = await reset(email);

        //console.log("result from reset:", result); ////
        this.#_.state.update(null);
        return result;
      };
    }

    if (signup) {
      this.#_.signup = async (email, password) => {
        const data = await signup(email, password);
        if (data.error) {
          this.#_.state.update(null);
        } else {
          this.#_.state.update(data);
        }
        return data;
      };
    }
  }
})();

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

css`
  iframe[name="iworker"] {
    width: 100%;
    /*height: 100vh;*/
    border: none;
    padding: 0;
    margin: 0;
  }

  iframe[name="iworker"] {
    /*
  position: absolute;
  top: 0;
  */

    /**/
    height: 100vh;
  }

  iframe[name="iworker"][state-hidden] {
    height: 0;
  }

  #app:has(iframe[name="iworker"]:not([state-hidden]))
    > :not([name="iworker"]) {
    /*display: none;*/
  }

  /* TODO Transfer to frame parcel*/
  frame-component {
    height: unset;
  }
`.use();

const iframe = component.iframe({
  name: "iworker",
  src: `${use.meta.server.origin}/iworker?iworker=`,
  //$stateHidden: true,
});

app.append(iframe);

await new Promise((resolve, reject) => {
  const onmessage = (event) => {
    if (event.origin !== use.meta.server.origin) {
      return;
    }
    if (event.data === "ready") {
      window.removeEventListener("message", onmessage);
      resolve(true);
    }
  };
  window.addEventListener("message", onmessage);
});

const show = component.button(
  "btn.btn-primary.m-3",
  {
    parent: frame,
    "on.click": (event) => {
      iframe.$.stateHidden = false;
    },
  },
  "Show iworker",
);

const iworker = new (class {
  #_ = {};

  constructor() {
    app.$.effects.add(
      ({ Y }) => {
        console.log("Y:", Y); ////
        iframe.contentWindow.postMessage(
          { type: "Y", Y },
          use.meta.server.origin,
        );
      },
      ["Y"],
    );
  }

  request({ timeout, visible } = {}) {
    return (specifier, ...args) => {
      return new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        const timer = (() => {
          if (timeout) {
            return setTimeout(() => {
              channel.port1.close();
              reject(
                new Error(
                  `Response from '${specifier}' took longer than ${timeout}ms`,
                ),
              );
            }, timeout);
          }
        })();

        channel.port1.onmessage = (event) => {
          if (timer) {
            clearTimeout(timer);
          }

          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data.result);
          }
          channel.port1.close();
        };
        iframe.contentWindow.postMessage(
          { type: "request", specifier, args, visible },
          use.meta.server.origin,
          [channel.port2],
        );
      });
    };
  }
})();

const Login = async () => {
  const forgot = component.a("link-primary cursor-pointer", {
    text: "Forgot password?",
  });

  const form = Form(
    `flex flex-col gap-y-3 py-1`,
    { "[login]": true },
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
    forgot,
  );

  const submit = component.button(".btn.btn-primary", {
    type: "button",
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
    host.tree.content.attribute.user = true;
    //console.log("host.tree:", host.tree); ////
    submit.on.click(async (event) => {
      form.clear(".alert");
      const valid = form.valid;
      if (valid) {
        const { email, password } = form.data;

        const result = await Spinner.while(
          { parent: host.tree.content, size: "6rem" },
          async () => {
            return await user.login(email, password);
          },
        );

        if (result.ok) {
          host.close(result);
        } else {
          form.append(Alert(result.message, { style: "danger" }));
        }
      }
    });

    forgot.on.click(async (event) => {
      event.preventDefault();
      forgot.remove();
      document.body.focus();
      host.close();
      setTimeout(async () => {
        await user.Reset();
      }, 200);
    });

    return form;
  };
  const result = await modal({ content, title: "Log in" }, submit);
  return result;
};

const Reset = async () => {
  const form = Form(
    `flex flex-col gap-y-3 py-1`,
    { "[reset]": true },
    Input({
      type: "email",
      label: "Email",
      name: "email",
      required: true,
    }),
  );

  const submit = component.button(".btn.btn-primary", {
    type: "button",
    text: "Send",
    disabled: true,
  });

  form.$.effects.add(
    ({ valid }, message) => {
      submit.disabled = !valid;
    },
    ["valid"],
  );

  const content = (host) => {
    host.tree.content.attribute.user = true;
    //console.log("host.tree:", host.tree); ////
    submit.on.click(async (event) => {
      form.clear(".alert");
      const valid = form.valid;
      if (valid) {
        const { email } = form.data;

        const data = await Spinner.while(
          {
            parent: host.tree.content,
            size: "6rem",
          },
          async () => {
            return await user.reset(email);
          },
        );

        //console.log("data:", data); ////
        if (data.error) {
          form.append(Alert(data.error, { style: "danger" }));
        } else {
          document.body.focus(); ////
          submit.remove();
          form.append(
            Alert(`An email with a reset link has been sent`, {
              style: "success",
            }),
          );
        }
      }
    });
    return form;
  };
  const result = await modal({ content, title: "Reset password" }, submit);
  return result;
};

await user.setup({
  Login,
  Reset,
  login: async (...args) => {
    const result = await iworker.request("@@/user:login", ...args);
    //console.log("result:", result); ////
    return result;
  },
  reset: async (...args) => {
    const result = await iworker.request("@@/user:reset", ...args);
    //console.log("result:", result); ////
    return result;
  },
});

iworker
  .request()("@@/echo/", 42)
  .then((result) => {
    console.log("echo result:", result);
  });

/*
iworker.request("@@/login/").then((result) => {
  console.log("result:", result);
});
*/

/*
const iframe2 = component.iframe({
  name: "iworker",
  src: `${use.meta.server.origin}/iworker`,
  parent: app
});
*/



//uffeat@gmail.com
