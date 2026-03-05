const { Route: k } = await use("@/router/"), { component: g } = await use("@/rollo/"), j = "/about", R = g.main("container pt-3", g.h1({ text: "About" }));
function L() {
  frame.clear(":not([slot])"), frame.append(this.page);
}
const A = k.create({ enter: L, page: R, path: j }), i = document.getElementById("frame"), { Route: N } = await use("@/router/"), { Bar: z } = await use("@/plotly/"), { component: w } = await use("@/rollo/"), { Spinner: E } = await use("/tools/spinner"), O = new class extends N {
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
    if (i.clear(":not([slot])"), i.append(this.page), !this.#t.plot) {
      const t = E({
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
}(), { Exception: S, pop: P } = await use("@/rollo/");
class T extends Map {
  constructor() {
    super();
  }
  async use(o) {
    S.if(!this.has(o), `Invalid key: ${o}.`);
    const e = this.get(o);
    return await e?.promise, e.data;
  }
}
const W = 5, C = await use("@/content/blog/_manifest.json"), b = Object.freeze(C.map(([t, o]) => t.slice(W))), d = new T();
for (const t of b) {
  const o = Promise.withResolvers();
  d.set(t, o);
}
for (const [t, o] of d.entries()) {
  const [e, s] = P(o, "resolve", "reject");
  use(`@/content/blog${t}.json`).then((a) => {
    const { html: r, meta: n } = a, { abstract: p, image: l, title: u } = n;
    o.data = { abstract: p, html: r, image: l, title: u }, e(o.data), delete o.promise, Object.freeze(o);
  }).catch((a) => {
    s(a);
  });
}
const { component: c } = await use("@/rollo/"), I = ({ path: t, abstract: o, image: e, title: s }) => {
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
}, { component: v } = await use("@/rollo/"), { NavLink: q } = await use("@/router/"), B = ({ html: t, path: o }) => {
  const e = v.from(t, { convert: !1 });
  for (const s of e.querySelectorAll("img")) {
    const a = s.getAttribute("src");
    a.startsWith("/") && s.replaceWith(v.img({ src: `${use.meta.base}${a}` }));
  }
  for (const s of e.querySelectorAll("a[href]")) {
    const a = s.getAttribute("href");
    a.startsWith("/") && (s.parentElement.classList.add("nav"), s.replaceWith(q("nav-link", { path: a, text: s.textContent })));
  }
  return e;
}, { Exception: _, component: h, pop: H, toTop: M } = await use("@/rollo/"), { router: D } = await use("@/router/"), { Route: F } = await use("@/router/"), Y = new class extends F {
  #t = {};
  constructor() {
    super({ page: h.main("container my-3") }), this.#t.cards = h.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5",
      { "[cards]": !0 }
    ), this.#t.post = h.div(), this.page.append(this.#t.cards, this.#t.post);
    const t = [...b], o = () => {
      if (!t.length) return;
      const e = t.shift();
      d.use(e).then((s) => {
        const [a, r, n] = H(
          s,
          "abstract",
          "image",
          "title"
        );
        Object.freeze(s);
        const p = I({ path: e, abstract: a, image: r, title: n });
        this.#t.cards.append(p), o();
      }).catch((s) => {
        _.raise(
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
          d.use(n).then((p) => {
            const { html: l } = p, u = B({ html: l, path: n });
            this.#t.post.detail.root.append(u), M(this.#t.post);
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
        const l = n.closest(".card");
        if (l) {
          const u = l.attribute.path;
          await D(`${t}${u}`);
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
    i.clear(":not([slot])"), i.append(this.page), this.page.$.view = e.at(0) || null;
  }
  /* Route LC. Runs every time the active route get a sub route (or query), 
  e.g., /notes/foo -> /notes/bar. */
  update(t, o, ...e) {
    this.page.$.view = e.at(0) || null;
  }
}(), { component: Z } = await use("@/rollo/"), { Nav: G } = await use("@/router/"), J = G(
  Z.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: i
  })
), { component: $ } = await use("@/rollo/"), { router: K, Route: Q, NavLink: U } = await use("@/router/"), f = "/", V = $.main("container pt-3", $.h1({ text: "Home" }));
function X() {
  i.clear(":not([slot])"), i.append(this.page);
}
const tt = Q.create({ enter: X, page: V, path: f });
K.routes.add(f, tt);
U("nav-link", {
  path: f,
  innerHTML: await use("/favicon.svg"),
  slot: "home",
  parent: i
});
const { component: m } = await use("@/rollo/"), { frame: x } = await use("@/frame/"), et = (t) => {
  const o = m.main(
    "container",
    m.h1({ text: "Page not found" })
  ), e = m.p({ parent: o });
  t ? (t instanceof Error && (t = t.message), e.text = t) : e.clear(), x.clear(":not([slot])"), x.append(o);
}, { capitalize: ot } = await use("@/rollo/"), { NavLink: st, router: y, Route: at } = await use("@/router/");
for (let [t, o] of Object.entries(
  /* @__PURE__ */ Object.assign({ "./routes/about/index.js": A, "./routes/bar/index.js": O, "./routes/notes/index.js": Y })
)) {
  t = `/${t.split("/").at(-2)}`;
  const e = ot(t.slice(1));
  st("nav-link", {
    text: e,
    path: t,
    title: e,
    parent: J
  }), y.routes.add(t, o);
}
const nt = async () => {
  await y.setup({
    error: et
  });
};
export {
  J as nav,
  nt as setup
};
