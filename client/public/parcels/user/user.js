const { Ref: h, app: S, component: s } = await use("@/rollo/"), { frame: x } = await use("@/frame/"), { server: w } = await use("@/server"), { Form: b, Input: m } = await use("@/form/"), { modal: y } = await use("@/modal/"), { Spinner: v } = await use("/tools/spinner"), u = new class {
  #t = {
    state: h.create(null)
  };
  constructor() {
  }
  get data() {
    return this.#t.state.current;
  }
  get effects() {
    return this.#t.state.effects;
  }
  async Login() {
    return await this.#t.Login();
  }
  async Logout() {
    return await this.#t.Logout();
  }
  async login(t, a) {
    return await this.#t.login(t, a);
  }
  async Signup() {
    return await this.#t.Signup();
  }
  async signup(t, a) {
    return await this.#t.signup(t, a);
  }
  async get() {
    return await this.#t.get();
  }
  async logout() {
    return await this.#t.logout();
  }
  async setup({
    Login: t,
    Logout: a,
    Signup: n,
    change: o,
    get: r,
    login: p,
    logout: d,
    reset: f,
    signup: g
  } = {}) {
    t && (this.#t.Login = async () => {
      const e = await t();
      return e && this.#t.state.update(e), e;
    }), a && (this.#t.Logout = async () => {
      const e = await a();
      return e && this.#t.state.update(null), e;
    }), n && (this.#t.Signup = async () => {
      const e = await n();
      return e && this.#t.state.update(e), e;
    }), r && (this.#t.get = async () => {
      const e = await r();
      return this.#t.state.update(e || null), e;
    }, await this.get()), p && (this.#t.login = async (e, i) => {
      const c = await p(e, i);
      return c.error ? this.#t.state.update(null) : this.#t.state.update(c), c;
    }), d && (this.#t.logout = async () => {
      const e = await d();
      return this.#t.state.update(null), e;
    }), g && (this.#t.signup = async (e, i) => {
      const c = await g(e, i);
      return c.error ? this.#t.state.update(null) : this.#t.state.update(c), c;
    });
  }
}();
if (use.meta.ANVIL)
  localStorage.removeItem("user");
else {
  const l = (t) => s.div(
    ".alert.alert-danger.alert-dismissible",
    { role: "alert" },
    s.div({ text: t }),
    s.button(".btn-close", {
      type: "button",
      "data.bsDismiss": "alert",
      ariaLabel: "Close"
    })
  );
  await u.setup({
    Login: async () => {
      const t = b(
        "flex flex-col gap-y-3 py-1",
        {},
        m({
          type: "email",
          label: "Email",
          name: "email",
          required: !0
        }),
        m({
          type: "password",
          name: "password",
          label: "Password",
          required: !0
        })
      ), a = s.button(".btn.btn-primary", {
        type: "button",
        text: "Submit",
        disabled: !0
      });
      return t.$.effects.add(
        ({ valid: r }, p) => {
          a.disabled = !r;
        },
        ["valid"]
      ), await y({ content: (r) => (a.on.click(async (p) => {
        if (t.clear(".alert"), t.valid) {
          const { email: f, password: g } = t.data;
          r.tree.content.update({ position: "relative" });
          const e = v({
            parent: r.tree.content,
            position: "absolute",
            top: "40%",
            size: "6rem"
          }), i = await u.login(f, g);
          e.remove(), i.error ? t.append(l(i.error)) : r.close(i);
        }
      }), t), title: "Log in" }, a);
    },
    Logout: async () => {
      if (await y(
        { content: (n) => (n.tree.footer.on.click(async (o) => {
          if (o.target?.tagName === "BUTTON")
            if (o.target.attribute.logout) {
              const r = await u.logout();
              n.close(r);
            } else
              n.close();
        }), s.p({
          text: "Do you wish to log out?"
        })), title: "Log out" },
        s.button(".btn.btn-primary", {
          text: "Yes",
          "[logout]": !0
        }),
        s.button(".btn.btn-secondary", {
          text: "No"
        })
      ))
        return await u.logout();
    },
    Signup: async () => {
      const t = b(
        "flex flex-col gap-y-3 py-1",
        {},
        m({
          type: "email",
          label: "Email",
          name: "email",
          required: !0
        }),
        m({
          type: "password",
          name: "password",
          label: "Password",
          required: !0
        })
      ), a = s.button(".btn.btn-primary", {
        type: "button",
        text: "Submit",
        disabled: !0
      });
      return t.$.effects.add(
        ({ valid: r }, p) => {
          a.disabled = !r;
        },
        ["valid"]
      ), await y({ content: (r) => (a.on.click(async (p) => {
        if (t.clear(".alert"), t.valid) {
          const { email: f, password: g } = t.data;
          r.tree.content.update({ position: "relative" });
          const e = v({
            parent: r.tree.content,
            position: "absolute",
            top: "40%",
            size: "6rem"
          }), i = await u.signup(f, g);
          e.remove(), i.error ? t.append(l(i.error)) : r.close(i);
        }
      }), t), title: "Sign up" }, a);
    },
    get: () => Object.freeze(
      JSON.parse(localStorage.getItem("user") || null)
    ),
    login: async (t, a) => {
      const { result: n } = await w.login(t, a);
      if (n.ok) {
        const o = { password: a, ...n.data };
        return localStorage.setItem("user", JSON.stringify(o)), Object.freeze(o);
      } else
        return localStorage.removeItem("user"), { error: n.message };
    },
    logout: async () => {
      await w.logout(), localStorage.removeItem("user");
    },
    signup: async (t, a) => {
      const { result: n } = await w.signup(t, a);
      if (n.ok) {
        const o = { password: a, ...n.data };
        return localStorage.setItem("user", JSON.stringify(o)), Object.freeze(o);
      } else
        return localStorage.removeItem("user"), { error: n.message };
    }
  });
}
const L = s.nav(
  "flex gap-3",
  { parent: x, slot: "top", "[user]": !0 },
  s.a("nav-link cursor-pointer", {
    text: "Log in",
    "[action]": "login"
  }),
  s.a("nav-link cursor-pointer", {
    text: "Sign up",
    "[action]": "signup"
  }),
  s.a("nav-link cursor-pointer", {
    text: "Log out",
    "[action]": "logout",
    "[user]": !0
  })
);
L.on.click(async (l) => {
  l.preventDefault();
  const t = l.target.attribute.action;
  if (t) {
    if (t === "login") {
      await u.Login();
      return;
    }
    if (t === "logout") {
      await u.Logout();
      return;
    }
    if (t === "signup") {
      await u.Signup();
      return;
    }
  }
});
u.effects.add((l) => {
  S.$.user = l;
});
export {
  u as user
};
