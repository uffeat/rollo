const { Ref: p, component: l } = await use("@/rollo/"), { frame: w } = await use("@/frame/"), { server: h } = await use("@/server"), { Form: v, Input: d } = await use("@/form/"), { modal: y } = await use("@/modal/"), f = new class {
  #t = {
    state: p.create(null)
  };
  constructor() {
    if (use.meta.ANVIL)
      localStorage.removeItem("user");
    else {
      const e = Object.freeze(
        JSON.parse(localStorage.getItem("user") || null)
      );
      e && this.#t.state.update(e), this.setup({
        Login: async () => {
          const t = v(
            "flex flex-col gap-y-3 py-1",
            {},
            d({
              type: "email",
              label: "Email",
              name: "email",
              required: !0
            }),
            d({
              type: "password",
              name: "password",
              label: "Password",
              required: !0
            })
          ), a = l.button(".btn.btn-primary", {
            text: "Submit",
            disabled: !0
          });
          return t.$.effects.add(
            ({ valid: n }, i) => {
              a.disabled = !n;
            },
            ["valid"]
          ), await y({ content: (n) => (a.on.click(async (i) => {
            if (t.valid) {
              const { email: s, password: m } = t.data, g = await f.login(s, m);
              g.error ? console.log("error:", g.error) : n.close(g);
            }
          }), t), title: "Log in" }, a);
        },
        login: async (t, a) => {
          const { result: r } = await h.login(t, a);
          if (r.ok) {
            const o = { password: a, ...r.data };
            return localStorage.setItem("user", JSON.stringify(o)), Object.freeze(o);
          } else
            return localStorage.removeItem("user"), { error: r.message };
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
  async login(e, t) {
    return await this.#t.login(e, t);
  }
  setup({ Login: e, change: t, login: a, logout: r, reset: o, signup: n } = {}) {
    e && (this.#t.Login = e), a && (this.#t.login = async (i, u) => {
      const s = await a(i, u);
      return s.error ? (this.#t.email = null, this.#t.password = null, this.#t.state.update(null), s) : (this.#t.email = i, this.#t.password = u, this.#t.state.update(s), s);
    });
  }
}(), b = l.nav(
  "flex gap-3",
  { parent: w, slot: "top" },
  l.a("nav-link cursor-pointer", {
    text: "Log in",
    _action: "login"
  }),
  l.a("nav-link cursor-pointer", {
    text: "Log out",
    _action: "logout"
  })
);
b.on.click(async (c) => {
  c.preventDefault();
  const e = c.target?._action;
  if (e && e === "login") {
    const t = await f.Login();
    console.log("result:", t);
    return;
  }
});
export {
  f as user
};
