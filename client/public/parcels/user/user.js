const { Ref: v, component: n } = await use("@/rollo/"), { frame: L } = await use("@/frame/"), { server: h } = await use("@/server"), { Form: x, Input: y } = await use("@/form/"), { modal: b } = await use("@/modal/"), c = new class {
  #t = {
    state: v.create(null)
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
  async login(t, s) {
    return await this.#t.login(t, s);
  }
  async get() {
    return await this.#t.get();
  }
  async logout() {
    return await this.#t.logout();
  }
  async setup({
    Login: t,
    Logout: s,
    Signup: i,
    change: o,
    get: u,
    login: g,
    logout: r,
    reset: w,
    signup: d
  } = {}) {
    t && (this.#t.Login = async () => {
      const a = await t();
      return a ? this.#t.state.update(a) : this.#t.state.update(null), a;
    }), s && (this.#t.Logout = async () => await s()), u && (this.#t.get = async () => {
      const a = await u();
      if (a) {
        const { email: f, password: l } = a;
        this.#t.email = f, this.#t.password = l, this.#t.state.update(a);
      } else
        this.#t.email = null, this.#t.password = null, this.#t.state.update(null);
      return a;
    }, await this.get()), g && (this.#t.login = async (a, f) => {
      const l = await g(a, f);
      return l.error ? (this.#t.email = null, this.#t.password = null, this.#t.state.update(null), l) : (this.#t.email = a, this.#t.password = f, this.#t.state.update(l), l);
    }), r && (this.#t.logout = async () => {
      await r(), this.#t.state.update(null);
    });
  }
}();
use.meta.ANVIL ? localStorage.removeItem("user") : await c.setup({
  Login: async () => {
    const e = x(
      "flex flex-col gap-y-3 py-1",
      {},
      y({
        type: "email",
        label: "Email",
        name: "email",
        required: !0
      }),
      y({
        type: "password",
        name: "password",
        label: "Password",
        required: !0
      })
    ), t = n.button(".btn.btn-primary", {
      text: "Submit",
      disabled: !0
    });
    return e.$.effects.add(
      ({ valid: o }, u) => {
        t.disabled = !o;
      },
      ["valid"]
    ), await b({ content: (o) => (t.on.click(async (u) => {
      if (e.valid) {
        const { email: r, password: w } = e.data, d = await c.login(r, w);
        n.p(), d.error ? console.log("error:", d.error) : o.close(d);
      }
    }), e), title: "Log in" }, t);
  },
  Logout: async () => {
    const e = n.button(".btn.btn-primary", {
      text: "Yes",
      $action: "logout"
    }), t = n.button(".btn.btn-secondary", {
      text: "No"
    }), i = await b({ content: (o) => (o.tree.footer.on.click(async (g) => {
      const r = g.target.getAttribute("state-action");
      r && (r === "logout" ? (await c.logout(), o.close(!0)) : o.close(!1));
    }), n.p({
      text: "Do you wish to log out?"
    })), title: "Log out" }, e, t);
    console.log("confirmed:", i);
  },
  get: () => Object.freeze(
    JSON.parse(localStorage.getItem("user") || null)
  ),
  login: async (e, t) => {
    const { result: s } = await h.login(e, t);
    if (s.ok) {
      const i = { password: t, ...s.data };
      return localStorage.setItem("user", JSON.stringify(i)), Object.freeze(i);
    } else
      return localStorage.removeItem("user"), { error: s.message };
  },
  logout: async () => {
    await h.logout(), localStorage.removeItem("user");
  }
});
const m = n.a("nav-link cursor-pointer", {
  text: "Log in",
  $action: "login"
}), p = n.a("nav-link cursor-pointer", {
  text: "Log out",
  $action: "logout"
}), k = n.nav(
  "flex gap-3",
  { parent: L, slot: "top" },
  m,
  p
);
k.on.click(async (e) => {
  e.preventDefault();
  const t = e.target?.getAttribute("state-action");
  if (t) {
    if (t === "login") {
      await c.Login();
      return;
    }
    if (t === "logout") {
      await c.Logout();
      return;
    }
  }
});
c.effects.add((e) => {
  e ? (m.classes.add("d-none"), p.classes.remove("d-none")) : (m.classes.remove("d-none"), p.classes.add("d-none"));
});
export {
  c as user
};
