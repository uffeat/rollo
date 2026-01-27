const { NavLink: k } = await use("@/router/"), { frame: g } = await use("@/frame/");
class l {
  static create = (...t) => new l(...t);
  #t = {};
  constructor({ page: t, path: e, text: s } = {}) {
    this.#t.page = t, this.#t.path = e, this.#t.text = s;
  }
  get page() {
    return this.#t.page;
  }
  get path() {
    return this.#t.path;
  }
  get link() {
    return k("nav-link", {
      text: this.text,
      path: this.path,
      title: this.text
    });
  }
  get text() {
    return this.#t.text;
  }
  async setup(t) {
  }
  async enter(t, e, ...s) {
    g.clear(":not([slot])"), g.append(this.page);
  }
  update(t, e, ...s) {
  }
  async exit(t) {
    this.page.remove();
  }
}
const { component: w } = await use("@/rollo/"), j = l.create({
  page: w.main("container pt-3", w.h1({ text: "About" }))
}), { Bar: L } = await use("@/plotly/"), { component: v } = await use("@/rollo/"), { Spinner: A } = await use("/tools/spinner"), N = new class extends l {
  #t = {};
  constructor() {
    super({
      page: v.main(
        "container pt-3",
        v.h1({ text: "Bar chart" })
      )
    });
  }
  async enter() {
    if (await super.enter(), !this.#t.plot) {
      const o = A({
        parent: this.page,
        size: "8rem",
        marginTop: "3rem"
      });
      this.#t.plot = await L(
        {
          xaxis: "Animal",
          yaxis: "Population",
          x: ["Zebras", "Lions", "Pelicans"]
        },
        /* Could also do:
        { "New York": [90, 40, 60] },
        { "San Francisco": [10, 80, 45] }
        */
        { "New York": [90, 40, 60], "San Francisco": [10, 80, 45] }
      ), o.remove(), this.page.append(this.#t.plot);
    }
  }
}(), { Exception: z, pop: O } = await use("@/rollo/");
class S extends Map {
  constructor() {
    super();
  }
  async use(t) {
    z.if(!this.has(t), `Invalid key: ${t}.`);
    const e = this.get(t);
    return await e?.promise, e.data;
  }
}
const E = 5, P = await use("@/content/blog/_manifest.json"), y = Object.freeze(P.map(([o, t]) => o.slice(E))), d = new S();
for (const o of y) {
  const t = Promise.withResolvers();
  d.set(o, t);
}
for (const [o, t] of d.entries()) {
  const [e, s] = O(t, "resolve", "reject");
  use(`@/content/blog${o}.json`).then((a) => {
    const { html: r, meta: n } = a, { abstract: c, image: p, title: u } = n;
    t.data = { abstract: c, html: r, image: p, title: u }, e(t.data), delete t.promise, Object.freeze(t);
  }).catch((a) => {
    s(a);
  });
}
const { component: i } = await use("@/rollo/"), T = ({ path: o, abstract: t, image: e, title: s }) => {
  const a = i.div(
    "card",
    {},
    i.img("card-img-top", function() {
      this.src = e.startsWith("/") ? `${use.meta.base}${e}` : e, this.alt = `Illustration of ${s.toLowerCase()}`;
    }),
    i.div(
      "card-body.nav.d-flex.flex-column",
      {},
      i.a(
        "nav-link cursor-pointer hover:underline! hover:underline-offset-6! hover:decoration-2!",
        i.h1("card-title", { text: s, title: s })
      ),
      i.p("card-text", { text: t })
    ),
    i.div("card-footer min-h-8")
  );
  return a.attribute.path = o, a;
}, { component: x } = await use("@/rollo/"), { NavLink: W } = await use("@/router/"), q = ({ html: o, path: t }) => {
  const e = x.from(o, { convert: !1 });
  for (const s of e.querySelectorAll("img")) {
    const a = s.getAttribute("src");
    a.startsWith("/") && s.replaceWith(x.img({ src: `${use.meta.base}${a}` }));
  }
  for (const s of e.querySelectorAll("a[href]")) {
    const a = s.getAttribute("href");
    a.startsWith("/") && (s.parentElement.classList.add("nav"), s.replaceWith(W("nav-link", { path: a, text: s.textContent })));
  }
  return e;
}, { Exception: C, component: h, pop: H, toTop: I } = await use("@/rollo/"), { router: R } = await use("@/router/"), B = new class extends l {
  #t = {};
  constructor() {
    super({ page: h.main("container my-3") }), this.#t.cards = h.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5"
    ), this.#t.post = h.div(), this.page.append(this.#t.cards, this.#t.post);
    const o = [...y], t = () => {
      if (!o.length) return;
      const e = o.shift();
      d.use(e).then((s) => {
        const [a, r, n] = H(
          s,
          "abstract",
          "image",
          "title"
        );
        Object.freeze(s);
        const c = T({ path: e, abstract: a, image: r, title: n });
        this.#t.cards.append(c), t();
      }).catch((s) => {
        C.raise(
          `Could not load card: ${e}`,
          () => console.error(s)
        );
      });
    };
    t(), this.page.$.effects.add(
      (e, s) => {
        s.owner.previous.view && this.#t.post.detail.root.clear();
        const r = e.view;
        if (r) {
          this.#t.cards.classes.add("hidden");
          const n = `/${r}`;
          d.use(n).then((c) => {
            const { html: p } = c, u = q({ html: p, path: n });
            this.#t.post.detail.root.append(u), I(this.#t.post);
          });
        } else
          this.#t.cards.classes.remove("hidden");
      },
      { run: !1 },
      ["view"]
    );
  }
  /* Route LC. Runs only once! */
  async setup(o) {
    this.page.on.click(async (r) => {
      r.preventDefault();
      const n = r.target;
      if (n.tagName === "A" ? n : n.closest("a")) {
        const p = n.closest(".card");
        if (p) {
          const u = p.attribute.path;
          await R(`${o}${u}`);
        }
      }
    });
    const { css: t } = await use("@/rollo/"), e = await use("@/bootstrap/reboot.css"), s = t`
      :is(h1, h2, h3, h4, h5, h6) {
        color: var(--bs-link-color);
      }

      img {
        max-width: 100%;
        min-width: 80%;
        border-radius: 0.5rem;
      }

      p:has(img) {
        display: flex;
        justify-content: center;
      }

      a {
        text-decoration: none;
        cursor: pointer;
      }

      a:hover {
        text-decoration: underline;
      }
    `, a = h.div();
    this.#t.post.attachShadow({ mode: "open" }), this.#t.post.shadowRoot.append(a), this.#t.post.detail.root = a, Object.freeze(this.#t.post.detail), e.use(this.#t.post), s.use(this.#t.post);
  }
  /* Route LC. Runs every time route becomes active. */
  async enter(o, t, ...e) {
    await super.enter(), this.page.$.view = e.at(0) || null;
  }
  /* Route LC. Runs every time the active route get a sub route (or query), 
  e.g., /notes/foo -> /notes/bar. */
  update(o, t, ...e) {
    this.page.$.view = e.at(0) || null;
  }
}(), { component: b } = await use("@/rollo/"), { router: M } = await use("@/router/"), { frame: D } = await use("@/frame/"), f = l.create({
  page: b.main("container pt-3", b.h1({ text: "Home" })),
  path: "/",
  text: "Home"
});
M.routes.add(f.path, f);
f.link.update({
  innerHTML: await use("/favicon.svg"),
  slot: "home",
  parent: D
});
const { component: m } = await use("@/rollo/"), { frame: $ } = await use("@/frame/"), F = (o) => {
  const t = m.main(
    "container",
    m.h1({ text: "Page not found" })
  ), e = m.p({ parent: t });
  o ? (o instanceof Error && (o = o.message), e.text = o) : e.clear(), $.clear(":not([slot])"), $.append(t);
}, { component: Y } = await use("@/rollo/"), { Nav: Z } = await use("@/router/"), { frame: G } = await use("@/frame/"), J = Z(
  Y.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: G
  })
), { capitalize: K } = await use("@/rollo/"), { NavLink: Q, router: _ } = await use("@/router/");
for (let [o, t] of Object.entries(
  /* @__PURE__ */ Object.assign({ "./routes/about/index.js": j, "./routes/bar/index.js": N, "./routes/notes/index.js": B })
)) {
  o = `/${o.split("/").at(-2)}`;
  const e = K(o.slice(1));
  Q("nav-link", {
    text: e,
    path: o,
    title: e,
    parent: J
  }), _.routes.add(o, t);
}
const U = async () => {
  await _.setup({
    error: F
  });
};
export {
  l as Route,
  J as nav,
  U as setup
};
