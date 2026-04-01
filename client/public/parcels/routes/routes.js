const { Route: R } = await use("@/router/"), { component: g } = await use("@/rollo/"), w = document.getElementById("frame"), I = "/about", L = g.main("container pt-3", g.h1({ text: "About" }));
function A() {
  w.clear(":not([slot])"), w.append(this.page);
}
const B = R.create({ enter: A, page: L, path: I }), { Route: N } = await use("@/router/"), { Bar: z } = await use("@/plotly/"), { component: v } = await use("@/rollo/"), { Spinner: O } = await use("/tools/spinner"), $ = document.getElementById("frame"), S = new class extends N {
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
      const t = O({
        parent: this.page,
        size: "8rem",
        marginTop: "3rem"
      });
      this.#t.plot = await z(
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
}(), { Exception: P, pop: T } = await use("@/rollo/");
class W extends Map {
  constructor() {
    super();
  }
  async use(o) {
    P.if(!this.has(o), `Invalid key: ${o}.`);
    const e = this.get(o);
    return await e?.promise, e.data;
  }
}
const C = 5, q = await use("@/content/blog/_manifest.json"), j = Object.freeze(q.map(([t, o]) => t.slice(C))), d = new W();
for (const t of j) {
  const o = Promise.withResolvers();
  d.set(t, o);
}
for (const [t, o] of d.entries()) {
  const [e, s] = T(o, "resolve", "reject");
  use(`@/content/blog${t}.json`).then((n) => {
    const { html: r, meta: a } = n, { abstract: i, image: p, title: l } = a;
    o.data = { abstract: i, html: r, image: p, title: l }, e(o.data), delete o.promise, Object.freeze(o);
  }).catch((n) => {
    s(n);
  });
}
const { component: c } = await use("@/rollo/"), _ = ({ path: t, abstract: o, image: e, title: s }) => {
  const n = c.div(
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
  return n.attribute.path = t, n;
}, { component: x } = await use("@/rollo/"), { NavLink: H } = await use("@/router/"), M = ({ html: t, path: o }) => {
  const e = x.from(t, { convert: !1 });
  for (const s of e.querySelectorAll("img")) {
    const n = s.getAttribute("src");
    n.startsWith("/") && s.replaceWith(x.img({ src: `${use.meta.base}${n}` }));
  }
  for (const s of e.querySelectorAll("a[href]")) {
    const n = s.getAttribute("href");
    n.startsWith("/") && (s.parentElement.classList.add("nav"), s.replaceWith(H("nav-link", { path: n, text: s.textContent })));
  }
  return e;
}, { Exception: D, component: u, pop: F, toTop: Y } = await use("@/rollo/"), { router: Z } = await use("@/router/"), { Route: G } = await use("@/router/"), b = document.getElementById("frame"), J = new class extends G {
  #t = {};
  constructor() {
    super({ page: u.main("container my-3") }), this.#t.cards = u.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5",
      { "[cards]": !0 }
    ), this.#t.post = u.div(), this.page.append(this.#t.cards, this.#t.post);
    const t = [...j], o = () => {
      if (!t.length) return;
      const e = t.shift();
      d.use(e).then((s) => {
        const [n, r, a] = F(
          s,
          "abstract",
          "image",
          "title"
        );
        Object.freeze(s);
        const i = _({ path: e, abstract: n, image: r, title: a });
        this.#t.cards.append(i), o();
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
          const a = `/${r}`;
          d.use(a).then((i) => {
            const { html: p } = i, l = M({ html: p, path: a });
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
      const a = r.target;
      if (a.tagName === "A" ? a : a.closest("a")) {
        const p = a.closest(".card");
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
    `, n = u.div();
    this.#t.post.attachShadow({ mode: "open" }), this.#t.post.shadowRoot.append(n), this.#t.post.detail.root = n, Object.freeze(this.#t.post.detail), e.use(this.#t.post), s.use(this.#t.post);
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
}(), { component: y } = await use("@/rollo/"), { router: K, Route: Q, NavLink: U } = await use("@/router/"), m = document.getElementById("frame"), f = "/", V = y.main("container pt-3", y.h1({ text: "Home" }));
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
const { component: h } = await use("@/rollo/"), k = document.getElementById("frame"), et = (t) => {
  const o = h.main(
    "container",
    h.h1({ text: "Page not found" })
  ), e = h.p({ parent: o });
  t ? (t instanceof Error && (t = t.message), e.text = t) : e.clear(), k.clear(":not([slot])"), k.append(o);
}, { component: ot } = await use("@/rollo/"), { Nav: st } = await use("@/router/"), nt = document.getElementById("frame"), at = st(
  ot.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: nt
  })
), { capitalize: rt } = await use("@/rollo/"), { NavLink: ct, router: E } = await use("@/router/");
for (let [t, o] of Object.entries(
  /* @__PURE__ */ Object.assign({ "./routes/about/index.js": B, "./routes/bar/index.js": S, "./routes/notes/index.js": J })
)) {
  t = `/${t.split("/").at(-2)}`;
  const e = rt(t.slice(1));
  ct("nav-link", {
    text: e,
    path: t,
    title: e,
    parent: at
  }), E.routes.add(t, o);
}
const it = async () => {
  await E.setup({
    error: et
  });
};
export {
  at as nav,
  it as setup
};
