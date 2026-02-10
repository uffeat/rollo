const { Ref: y, component: i } = await use("@/rollo/"), { frame: v } = await use("@/frame/"), { server: p } = await use("@/server"), { Form: b, Input: w } = await use("@/form/"), { modal: L } = await use("@/modal/"), u = new class {
  #t = {
    state: y.create(null)
  };
  constructor() {
    if (use.meta.ANVIL)
      localStorage.removeItem("user");
    else {
      const t = Object.freeze(
        JSON.parse(localStorage.getItem("user") || null)
      );
      t && this.#t.state.update(t), this.setup({
        Login: async () => {
          const e = b(
            "flex flex-col gap-y-3 py-1",
            {},
            w({
              type: "email",
              label: "Email",
              name: "email",
              required: !0
            }),
            w({
              type: "password",
              name: "password",
              label: "Password",
              required: !0
            })
          ), a = i.button(".btn.btn-primary", {
            text: "Submit",
            disabled: !0
          });
          return e.$.effects.add(
            ({ valid: c }, s) => {
              a.disabled = !c;
            },
            ["valid"]
          ), await L({ content: (c) => (a.on.click(async (s) => {
            if (e.valid) {
              const { email: r, password: h } = e.data, g = await u.login(r, h);
              i.p(), g.error ? console.log("error:", g.error) : c.close(g);
            }
          }), e), title: "Log in" }, a);
        },
        login: async (e, a) => {
          const { result: o } = await p.login(e, a);
          if (o.ok) {
            const l = { password: a, ...o.data };
            return localStorage.setItem("user", JSON.stringify(l)), Object.freeze(l);
          } else
            return localStorage.removeItem("user"), { error: o.message };
        },
        logout: async () => {
          await p.logout(), localStorage.removeItem("user");
        }
      });
    }
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
  async login(t, e) {
    return await this.#t.login(t, e);
  }
  async logout() {
    return await this.#t.logout();
  }
  setup({ Login: t, change: e, login: a, logout: o, reset: l, signup: c } = {}) {
    t && (this.#t.Login = async () => {
      const s = await t();
      return s ? this.#t.state.update(s) : this.#t.state.update(null), s;
    }), a && (this.#t.login = async (s, d) => {
      const r = await a(s, d);
      return r.error ? (this.#t.email = null, this.#t.password = null, this.#t.state.update(null), r) : (this.#t.email = s, this.#t.password = d, this.#t.state.update(r), r);
    }), o && (this.#t.logout = async () => {
      await o(), this.#t.state.update(null);
    });
  }
}(), f = i.a("nav-link cursor-pointer", {
  text: "Log in",
  $action: "login"
}), m = i.a("nav-link cursor-pointer", {
  text: "Log out",
  $action: "logout"
}), S = i.nav(
  "flex gap-3",
  { parent: v, slot: "top" },
  f,
  m
);
S.on.click(async (n) => {
  n.preventDefault();
  const t = n.target?.getAttribute("state-action");
  if (t) {
    if (t === "login") {
      await u.Login();
      return;
    }
    if (t === "logout") {
      await u.logout();
      return;
    }
  }
});
u.effects.add((n) => {
  console.log("current:", n), n ? (f.classes.add("d-none"), m.classes.remove("d-none")) : (f.classes.remove("d-none"), m.classes.add("d-none"));
});
export {
  u as user
};
