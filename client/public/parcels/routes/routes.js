const { Route: y } = await use("@/router/"), { component: g } = await use("@/rollo/"), k = "/about", j = g.main("container pt-3", g.h1({ text: "About" }));
function R() {
  frame.clear(":not([slot])"), frame.append(this.page);
}
const L = y.create({ enter: R, page: j, path: k }), r = document.getElementById("frame"), { Route: A } = await use("@/router/"), { Bar: N } = await use("@/plotly/"), { component: w } = await use("@/rollo/"), { Spinner: z } = await use("/tools/spinner"), E = new class extends A {
  #t = {};
  constructor() {
    super({
      page: w.main(
        "container pt-3",
        w.h1({ text: "Bar chart" })
      )
    });
  }
  async enter() {
    if (r.clear(":not([slot])"), r.append(this.page), !this.#t.plot) {
      const t = z({
        parent: this.page,
        size: "8rem",
        marginTop: "3rem"
      });
      this.#t.plot = await N(
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
}(), { Exception: O, pop: S } = await use("@/rollo/");
class P extends Map {
  constructor() {
    super();
  }
  async use(o) {
    O.if(!this.has(o), `Invalid key: ${o}.`);
    const e = this.get(o);
    return await e?.promise, e.data;
  }
}
const T = 5, W = await use("@/content/blog/_manifest.json"), x = Object.freeze(W.map(([t, o]) => t.slice(T))), d = new P();
for (const t of x) {
  const o = Promise.withResolvers();
  d.set(t, o);
}
for (const [t, o] of d.entries()) {
  const [e, s] = S(o, "resolve", "reject");
  use(`@/content/blog${t}.json`).then((a) => {
    const { html: i, meta: n } = a, { abstract: p, image: l, title: u } = n;
    o.data = { abstract: p, html: i, image: l, title: u }, e(o.data), delete o.promise, Object.freeze(o);
  }).catch((a) => {
    s(a);
  });
}
const { component: c } = await use("@/rollo/"), C = ({ path: t, abstract: o, image: e, title: s }) => {
  const a = c.div(
    "card",
    {},
    c.img("card-img-top", function() {
      this.src = e.startsWith("/") ? `${use.meta.base}${e}` : e, this.alt = `Illustration of ${s.toLowerCase()}`;
    }),
    c.div(
      "card-body.nav.d-flex.flex-column",
      {},
      c.a(
        "nav-link cursor-pointer hover:underline! hover:underline-offset-6! hover:decoration-2!",
        c.h1("card-title", { text: s, title: s })
      ),
      c.p("card-text", { text: o })
    ),
    c.div("card-footer min-h-8")
  );
  return a.attribute.path = t, a;
}, { component: v } = await use("@/rollo/"), { NavLink: I } = await use("@/router/"), q = ({ html: t, path: o }) => {
  const e = v.from(t, { convert: !1 });
  for (const s of e.querySelectorAll("img")) {
    const a = s.getAttribute("src");
    a.startsWith("/") && s.replaceWith(v.img({ src: `${use.meta.base}${a}` }));
  }
  for (const s of e.querySelectorAll("a[href]")) {
    const a = s.getAttribute("href");
    a.startsWith("/") && (s.parentElement.classList.add("nav"), s.replaceWith(I("nav-link", { path: a, text: s.textContent })));
  }
  return e;
}, { Exception: B, component: h, pop: _, toTop: H } = await use("@/rollo/"), { router: M } = await use("@/router/"), { Route: D } = await use("@/router/"), F = new class extends D {
  #t = {};
  constructor() {
    super({ page: h.main("container my-3") }), this.#t.cards = h.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5",
      { "[cards]": !0 }
    ), this.#t.post = h.div(), this.page.append(this.#t.cards, this.#t.post);
    const t = [...x], o = () => {
      if (!t.length) return;
      const e = t.shift();
      d.use(e).then((s) => {
        const [a, i, n] = _(
          s,
          "abstract",
          "image",
          "title"
        );
        Object.freeze(s);
        const p = C({ path: e, abstract: a, image: i, title: n });
        this.#t.cards.append(p), o();
      }).catch((s) => {
        B.raise(
          `Could not load card: ${e}`,
          () => console.error(s)
        );
      });
    };
    o(), this.page.$.effects.add(
      (e, s) => {
        s.owner.previous.view && this.#t.post.detail.root.clear();
        const i = e.view;
        if (i) {
          this.#t.cards.classes.replace("grid", "hidden");
          const n = `/${i}`;
          d.use(n).then((p) => {
            const { html: l } = p, u = q({ html: l, path: n });
            this.#t.post.detail.root.append(u), H(this.#t.post);
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
    this.page.on.click(async (i) => {
      i.preventDefault();
      const n = i.target;
      if (n.tagName === "A" ? n : n.closest("a")) {
        const l = n.closest(".card");
        if (l) {
          const u = l.attribute.path;
          await M(`${t}${u}`);
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
    `, a = h.div();
    this.#t.post.attachShadow({ mode: "open" }), this.#t.post.shadowRoot.append(a), this.#t.post.detail.root = a, Object.freeze(this.#t.post.detail), e.use(this.#t.post), s.use(this.#t.post);
  }
  /* Route LC. Runs every time route becomes active. */
  async enter(t, o, ...e) {
    r.clear(":not([slot])"), r.append(this.page), this.page.$.view = e.at(0) || null;
  }
  /* Route LC. Runs every time the active route get a sub route (or query), 
  e.g., /notes/foo -> /notes/bar. */
  update(t, o, ...e) {
    this.page.$.view = e.at(0) || null;
  }
}(), { component: Y } = await use("@/rollo/"), { Nav: Z } = await use("@/router/"), G = Z(
  Y.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: r
  })
), { component: $ } = await use("@/rollo/"), { router: J, Route: K, NavLink: Q } = await use("@/router/"), f = "/", U = $.main("container pt-3", $.h1({ text: "Home" }));
function V() {
  r.clear(":not([slot])"), r.append(this.page);
}
const X = K.create({ enter: V, page: U, path: f });
J.routes.add(f, X);
Q("nav-link", {
  path: f,
  innerHTML: await use("/favicon.svg"),
  slot: "home",
  parent: r
});
const { component: m } = await use("@/rollo/"), tt = (t) => {
  const o = m.main(
    "container",
    m.h1({ text: "Page not found" })
  ), e = m.p({ parent: o });
  t ? (t instanceof Error && (t = t.message), e.text = t) : e.clear(), r.clear(":not([slot])"), r.append(o);
}, { capitalize: et } = await use("@/rollo/"), { NavLink: ot, router: b, Route: st } = await use("@/router/");
for (let [t, o] of Object.entries(
  /* @__PURE__ */ Object.assign({ "./routes/about/index.js": L, "./routes/bar/index.js": E, "./routes/notes/index.js": F })
)) {
  t = `/${t.split("/").at(-2)}`;
  const e = et(t.slice(1));
  ot("nav-link", {
    text: e,
    path: t,
    title: e,
    parent: G
  }), b.routes.add(t, o);
}
const at = async () => {
  await b.setup({
    error: tt
  });
};
export {
  G as nav,
  at as setup
};
