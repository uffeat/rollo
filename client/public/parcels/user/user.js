const { Ref: h, component: s } = await use("@/rollo/"), { frame: L } = await use("@/frame/"), { server: y } = await use("@/server"), { Form: x, Input: b } = await use("@/form/"), { modal: v } = await use("@/modal/"), { Spinner: S } = await use("/tools/spinner"), l = new class {
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
  async get() {
    return await this.#t.get();
  }
  async logout() {
    return await this.#t.logout();
  }
  async setup({
    Login: t,
    Logout: a,
    Signup: o,
    change: i,
    get: n,
    login: c,
    logout: g,
    reset: m,
    signup: w
  } = {}) {
    t && (this.#t.Login = async () => {
      const e = await t();
      return e && this.#t.state.update(e), e;
    }), a && (this.#t.Logout = async () => {
      const e = await a();
      return e && this.#t.state.update(null), e;
    }), n && (this.#t.get = async () => {
      const e = await n();
      return this.#t.state.update(e || null), e;
    }, await this.get()), c && (this.#t.login = async (e, u) => {
      const d = await c(e, u);
      return d.error ? this.#t.state.update(null) : this.#t.state.update(d), d;
    }), g && (this.#t.logout = async () => {
      const e = await g();
      return this.#t.state.update(null), e;
    });
  }
}();
if (use.meta.ANVIL)
  localStorage.removeItem("user");
else {
  const r = (t) => s.div(
    ".alert.alert-danger.alert-dismissible",
    { role: "alert" },
    s.div({ text: t }),
    s.button(".btn-close", {
      type: "button",
      "data.bsDismiss": "alert",
      ariaLabel: "Close"
    })
  );
  await l.setup({
    Login: async () => {
      const t = x(
        "flex flex-col gap-y-3 py-1",
        {},
        b({
          type: "email",
          label: "Email",
          name: "email",
          required: !0
        }),
        b({
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
        ({ valid: n }, c) => {
          a.disabled = !n;
        },
        ["valid"]
      ), await v({ content: (n) => (a.on.click(async (c) => {
        if (t.clear(".alert"), t.valid) {
          const { email: m, password: w } = t.data;
          n.tree.content.update({ position: "relative" });
          const e = S({
            parent: n.tree.content,
            position: "absolute",
            top: "40%",
            size: "6rem"
          }), u = await l.login(m, w);
          e.remove(), u.error ? t.append(r(u.error)) : n.close(u);
        }
      }), t), title: "Log in" }, a);
    },
    Logout: async () => {
      if (await v(
        { content: (o) => (o.tree.footer.on.click(async (i) => {
          if (i.target?.tagName === "BUTTON")
            if (i.target.attribute.logout) {
              const n = await l.logout();
              o.close(n);
            } else
              o.close();
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
        return await l.logout();
    },
    get: () => Object.freeze(
      JSON.parse(localStorage.getItem("user") || null)
    ),
    login: async (t, a) => {
      const { result: o } = await y.login(t, a);
      if (o.ok) {
        const i = { password: a, ...o.data };
        return localStorage.setItem("user", JSON.stringify(i)), Object.freeze(i);
      } else
        return localStorage.removeItem("user"), { error: o.message };
    },
    logout: async () => {
      await y.logout(), localStorage.removeItem("user");
    }
  });
}
const f = s.a("nav-link cursor-pointer", {
  text: "Log in",
  $action: "login"
}), p = s.a("nav-link cursor-pointer", {
  text: "Log out",
  $action: "logout"
}), k = s.nav(
  "flex gap-3",
  { parent: L, slot: "top" },
  f,
  p
);
k.on.click(async (r) => {
  r.preventDefault();
  const t = r.target?.getAttribute("state-action");
  if (t) {
    if (t === "login") {
      await l.Login();
      return;
    }
    if (t === "logout") {
      await l.Logout();
      return;
    }
  }
});
l.effects.add((r) => {
  r ? (f.classes.add("d-none"), p.classes.remove("d-none")) : (f.classes.remove("d-none"), p.classes.add("d-none"));
});
export {
  l as user
};
