const { Ref: S } = await use("@/rollo/"), i = new class {
  #t = {
    state: S.create(null)
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
  async Reset() {
    return await this.#t.Reset();
  }
  async Signup() {
    return await this.#t.Signup();
  }
  async get() {
    return await this.#t.get();
  }
  async login(t, a) {
    return await this.#t.login(t, a);
  }
  async logout() {
    return await this.#t.logout();
  }
  async reset(t) {
    return await this.#t.reset(t);
  }
  async signup(t, a) {
    return await this.#t.signup(t, a);
  }
  async setup({
    Login: t,
    Logout: a,
    Reset: s,
    Signup: r,
    change: o,
    get: l,
    login: p,
    logout: u,
    reset: c,
    signup: m
  } = {}) {
    t && (this.#t.Login = async () => {
      const n = await t();
      return n && this.#t.state.update(n), n;
    }), a && (this.#t.Logout = async () => {
      const n = await a();
      return n && this.#t.state.update(null), n;
    }), s && (this.#t.Reset = async () => {
      const n = await s();
      return n && this.#t.state.update(null), n;
    }), r && (this.#t.Signup = async () => {
      const n = await r();
      return n && this.#t.state.update(n), n;
    }), l && (this.#t.get = async () => {
      const n = await l();
      return this.#t.state.update(n || null), n;
    }, await this.get()), p && (this.#t.login = async (n, g) => {
      const d = await p(n, g);
      return d.error ? this.#t.state.update(null) : this.#t.state.update(d), d;
    }), u && (this.#t.logout = async () => {
      const n = await u();
      return this.#t.state.update(null), n;
    }), c && (this.#t.reset = async (n) => {
      const g = await c(n);
      return console.log("result from reset:", g), this.#t.state.update(null), g;
    }), m && (this.#t.signup = async (n, g) => {
      const d = await m(n, g);
      return d.error ? this.#t.state.update(null) : this.#t.state.update(d), d;
    });
  }
}(), { component: y } = await use("@/rollo/"), { Form: $, Input: b } = await use("@/form/"), { modal: x } = await use("@/modal/"), { Spinner: k } = await use("/tools/spinner"), { Alert: I } = await use("/tools/alert"), L = async () => {
  const e = y.a("link-primary cursor-pointer", {
    text: "Forgot password?"
  }), t = $(
    "flex flex-col gap-y-3 py-1",
    { "[login]": !0 },
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
    }),
    e
  ), a = y.button(".btn.btn-primary", {
    type: "button",
    text: "Submit",
    disabled: !0
  });
  return t.$.effects.add(
    ({ valid: o }, l) => {
      a.disabled = !o;
    },
    ["valid"]
  ), await x({ content: (o) => (o.tree.content.attribute.user = !0, a.on.click(async (l) => {
    if (t.clear(".alert"), t.valid) {
      const { email: u, password: c } = t.data, m = await k.while(
        { parent: o.tree.content, size: "6rem" },
        async () => await i.login(u, c)
      );
      m.error ? t.append(I(m.error, { style: "danger" })) : o.close(m);
    }
  }), e.on.click(async (l) => {
    l.preventDefault(), e.remove(), document.body.focus(), o.close(), setTimeout(async () => {
      await i.Reset();
    }, 200);
  }), t), title: "Log in" }, a);
}, { component: f } = await use("@/rollo/"), { modal: z } = await use("@/modal/"), { Spinner: A } = await use("/tools/spinner"), N = async () => {
  if (await z(
    { content: (a) => (a.tree.content.attribute.user = !0, a.tree.footer.on.click(async (s) => {
      if (s.target?.tagName === "BUTTON")
        if (s.target.attribute.logout) {
          const r = await A.while(
            { parent: a.tree.content, size: "6rem" },
            async () => await i.logout()
          );
          a.close(r);
        } else
          a.close();
    }), f.p({
      text: "Do you wish to log out?"
    })), title: "Log out" },
    f.button(".btn.btn-primary", {
      text: "Yes",
      "[logout]": !0
    }),
    f.button(".btn.btn-secondary", {
      text: "No"
    })
  ))
    return await i.logout();
}, { component: O } = await use("@/rollo/"), { Form: F, Input: R } = await use("@/form/"), { modal: q } = await use("@/modal/"), { Spinner: _ } = await use("/tools/spinner"), { Alert: h } = await use("/tools/alert"), j = async () => {
  const e = F(
    "flex flex-col gap-y-3 py-1",
    { "[reset]": !0 },
    R({
      type: "email",
      label: "Email",
      name: "email",
      required: !0
    })
  ), t = O.button(".btn.btn-primary", {
    type: "button",
    text: "Send",
    disabled: !0
  });
  return e.$.effects.add(
    ({ valid: r }, o) => {
      t.disabled = !r;
    },
    ["valid"]
  ), await q({ content: (r) => (r.tree.content.attribute.user = !0, t.on.click(async (o) => {
    if (e.clear(".alert"), e.valid) {
      const { email: p } = e.data, u = await _.while(
        {
          parent: r.tree.content,
          size: "6rem"
        },
        async () => await i.reset(p)
      );
      u.error ? e.append(h(u.error, { style: "danger" })) : (document.body.focus(), t.remove(), e.append(
        h("An email with a reset link has been sent", {
          style: "success"
        })
      ));
    }
  }), e), title: "Reset password" }, t);
}, { component: D } = await use("@/rollo/"), { Form: E, Input: v } = await use("@/form/"), { modal: J } = await use("@/modal/"), { Spinner: T } = await use("/tools/spinner"), { Alert: P } = await use("/tools/alert"), U = async () => {
  const e = E(
    "flex flex-col gap-y-3 py-1",
    { "[signup]": !0 },
    v({
      type: "email",
      label: "Email",
      name: "email",
      required: !0
    }),
    v({
      type: "password",
      name: "password",
      label: "Password",
      required: !0
    })
  ), t = D.button(".btn.btn-primary", {
    type: "button",
    text: "Submit",
    disabled: !0
  });
  return e.$.effects.add(
    ({ valid: r }, o) => {
      t.disabled = !r;
    },
    ["valid"]
  ), await J({ content: (r) => (r.tree.content.attribute.user = !0, t.on.click(async (o) => {
    if (e.clear(".alert"), e.valid) {
      const { email: p, password: u } = e.data, c = await T.while(
        {
          parent: r.tree.content,
          size: "6rem"
        },
        async () => await i.signup(p, u)
      );
      c.error ? e.append(P(c.error, { style: "danger" })) : r.close(c);
    }
  }), e), title: "Sign up" }, t);
}, { app: B, component: w } = await use("@/rollo/"), { frame: V } = await use("@/frame/");
if (use.meta.ANVIL)
  localStorage.removeItem("user");
else {
  const { server: e } = await use("@/server");
  await i.setup({
    Login: L,
    Logout: N,
    Reset: j,
    Signup: U,
    get: () => Object.freeze(
      JSON.parse(localStorage.getItem("user") || null)
    ),
    login: async (t, a) => {
      const { result: s } = await e.login(t, a);
      if (s.ok) {
        const r = { password: a, ...s.data };
        return localStorage.setItem("user", JSON.stringify(r)), Object.freeze(r);
      } else
        return localStorage.removeItem("user"), { error: s.message };
    },
    logout: async () => {
      await e.logout(), localStorage.removeItem("user");
    },
    reset: async (t) => {
      const { result: a } = await e.send_password_reset_email(t);
      return a.ok ? (localStorage.removeItem("user"), {}) : { error: a.message };
    },
    signup: async (t, a) => {
      const { result: s } = await e.signup(t, a);
      if (s.ok) {
        const r = { password: a, ...s.data };
        return localStorage.setItem("user", JSON.stringify(r)), Object.freeze(r);
      } else
        return localStorage.removeItem("user"), { error: s.message };
    }
  });
}
const Y = w.nav(
  "flex gap-3",
  { parent: V, slot: "top", "[user]": !0 },
  w.a("nav-link cursor-pointer", {
    text: "Log in",
    "[action]": "login"
  }),
  w.a("nav-link cursor-pointer", {
    text: "Sign up",
    "[action]": "signup"
  }),
  w.a("nav-link cursor-pointer", {
    text: "Log out",
    "[action]": "logout",
    "[user]": !0
  })
);
Y.on.click(async (e) => {
  e.preventDefault();
  const t = e.target.attribute.action;
  if (t) {
    if (t === "login") {
      await i.Login();
      return;
    }
    if (t === "logout") {
      await i.Logout();
      return;
    }
    if (t === "signup") {
      await i.Signup();
      return;
    }
  }
});
i.effects.add((e) => {
  B.$.user = e;
});
export {
  L as Login,
  N as Logout,
  j as Reset,
  U as Signup,
  i as user
};
