const { Route: L } = await use("@/router/"), { component: w } = await use("@/rollo/"), { frame: g } = await use("@/frame/"), A = "/about", N = w.main("container pt-3", w.h1({ text: "About" }));
function z() {
  g.clear(":not([slot])"), g.append(this.page);
}
const O = L.create({ enter: z, page: N, path: A }), { Route: S } = await use("@/router/"), { Bar: E } = await use("@/plotly/"), { component: v } = await use("@/rollo/"), { frame: $ } = await use("@/frame/"), { Spinner: P } = await use("/tools/spinner"), T = new class extends S {
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
    if ($.clear(":not([slot])"), $.append(this.page), !this.#t.plot) {
      const t = P({
        parent: this.page,
        size: "8rem",
        marginTop: "3rem"
      });
      this.#t.plot = await E(
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
      ), t.remove(), this.page.append(this.#t.plot);
    }
  }
}(), { Exception: W, pop: C } = await use("@/rollo/");
class q extends Map {
  constructor() {
    super();
  }
  async use(o) {
    W.if(!this.has(o), `Invalid key: ${o}.`);
    const e = this.get(o);
    return await e?.promise, e.data;
  }
}
const I = 5, _ = await use("@/content/blog/_manifest.json"), j = Object.freeze(_.map(([t, o]) => t.slice(I))), h = new q();
for (const t of j) {
  const o = Promise.withResolvers();
  h.set(t, o);
}
for (const [t, o] of h.entries()) {
  const [e, s] = C(o, "resolve", "reject");
  use(`@/content/blog${t}.json`).then((a) => {
    const { html: r, meta: n } = a, { abstract: c, image: p, title: l } = n;
    o.data = { abstract: c, html: r, image: p, title: l }, e(o.data), delete o.promise, Object.freeze(o);
  }).catch((a) => {
    s(a);
  });
}
const { component: i } = await use("@/rollo/"), B = ({ path: t, abstract: o, image: e, title: s }) => {
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
      i.p("card-text", { text: o })
    ),
    i.div("card-footer min-h-8")
  );
  return a.attribute.path = t, a;
}, { component: x } = await use("@/rollo/"), { NavLink: H } = await use("@/router/"), M = ({ html: t, path: o }) => {
  const e = x.from(t, { convert: !1 });
  for (const s of e.querySelectorAll("img")) {
    const a = s.getAttribute("src");
    a.startsWith("/") && s.replaceWith(x.img({ src: `${use.meta.base}${a}` }));
  }
  for (const s of e.querySelectorAll("a[href]")) {
    const a = s.getAttribute("href");
    a.startsWith("/") && (s.parentElement.classList.add("nav"), s.replaceWith(H("nav-link", { path: a, text: s.textContent })));
  }
  return e;
}, { Exception: D, component: u, pop: F, toTop: Y } = await use("@/rollo/"), { router: Z } = await use("@/router/"), { Route: G } = await use("@/router/"), { frame: b } = await use("@/frame/"), J = new class extends G {
  #t = {};
  constructor() {
    super({ page: u.main("container my-3") }), this.#t.cards = u.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5",
      { "[cards]": !0 }
    ), this.#t.post = u.div(), this.page.append(this.#t.cards, this.#t.post);
    const t = [...j], o = () => {
      if (!t.length) return;
      const e = t.shift();
      h.use(e).then((s) => {
        const [a, r, n] = F(
          s,
          "abstract",
          "image",
          "title"
        );
        Object.freeze(s);
        const c = B({ path: e, abstract: a, image: r, title: n });
        this.#t.cards.append(c), o();
      }).catch((s) => {
        D.raise(
          `Could not load card: ${e}`,
          () => console.error(s)
        );
      });
    };
    o(), this.page.$.effects.add(
      (e, s) => {
        s.owner.previous.view && this.#t.post.detail.root.clear();
        const r = e.view;
        if (r) {
          this.#t.cards.classes.replace("grid", "hidden");
          const n = `/${r}`;
          h.use(n).then((c) => {
            const { html: p } = c, l = M({ html: p, path: n });
            this.#t.post.detail.root.append(l), Y(this.#t.post);
          });
        } else
          this.#t.cards.classes.replace("hidden", "grid");
      },
      { run: !1 },
      ["view"]
    );
  }
  /* Route LC. Runs only once! */
  async setup(t) {
    this.page.on.click(async (r) => {
      r.preventDefault();
      const n = r.target;
      if (n.tagName === "A" ? n : n.closest("a")) {
        const p = n.closest(".card");
        if (p) {
          const l = p.attribute.path;
          await Z(`${t}${l}`);
        }
      }
    });
    const { css: o } = await use("@/rollo/"), e = await use("@/bootstrap/reboot.css"), s = o`
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
    `, a = u.div();
    this.#t.post.attachShadow({ mode: "open" }), this.#t.post.shadowRoot.append(a), this.#t.post.detail.root = a, Object.freeze(this.#t.post.detail), e.use(this.#t.post), s.use(this.#t.post);
  }
  /* Route LC. Runs every time route becomes active. */
  async enter(t, o, ...e) {
    b.clear(":not([slot])"), b.append(this.page), this.page.$.view = e.at(0) || null;
  }
  /* Route LC. Runs every time the active route get a sub route (or query), 
  e.g., /notes/foo -> /notes/bar. */
  update(t, o, ...e) {
    this.page.$.view = e.at(0) || null;
  }
}(), { component: y } = await use("@/rollo/"), { router: K, Route: Q, NavLink: U } = await use("@/router/"), { frame: m } = await use("@/frame/"), f = "/", V = y.main("container pt-3", y.h1({ text: "Home" }));
function X() {
  m.clear(":not([slot])"), m.append(this.page);
}
const tt = Q.create({ enter: X, page: V, path: f });
K.routes.add(f, tt);
U("nav-link", {
  path: f,
  innerHTML: await use("/favicon.svg"),
  slot: "home",
  parent: m
});
const { component: d } = await use("@/rollo/"), { frame: k } = await use("@/frame/"), et = (t) => {
  const o = d.main(
    "container",
    d.h1({ text: "Page not found" })
  ), e = d.p({ parent: o });
  t ? (t instanceof Error && (t = t.message), e.text = t) : e.clear(), k.clear(":not([slot])"), k.append(o);
}, { component: ot } = await use("@/rollo/"), { Nav: st } = await use("@/router/"), { frame: at } = await use("@/frame/"), nt = st(
  ot.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: at
  })
), { capitalize: rt } = await use("@/rollo/"), { NavLink: it, router: R } = await use("@/router/");
for (let [t, o] of Object.entries(
  /* @__PURE__ */ Object.assign({ "./routes/about/index.js": O, "./routes/bar/index.js": T, "./routes/notes/index.js": J })
)) {
  t = `/${t.split("/").at(-2)}`;
  const e = rt(t.slice(1));
  it("nav-link", {
    text: e,
    path: t,
    title: e,
    parent: nt
  }), R.routes.add(t, o);
}
const ct = async () => {
  await R.setup({
    error: et
  });
};
export {
  nt as nav,
  ct as setup
};
