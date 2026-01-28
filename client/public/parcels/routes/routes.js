const { Route: R } = await use("@/router/"), { component: w } = await use("@/rollo/"), L = "/about", A = w.main("container pt-3", w.h1({ text: "About" }));
function N() {
  frame.clear(":not([slot])"), frame.append(this.page);
}
const z = R.create({ enter: N, page: A, path: L }), { Route: O } = await use("@/router/"), { Bar: S } = await use("@/plotly/"), { component: g } = await use("@/rollo/"), { frame: v } = await use("@/frame/"), { Spinner: E } = await use("/tools/spinner"), P = new class extends O {
  #t = {};
  constructor() {
    super({
      page: g.main(
        "container pt-3",
        g.h1({ text: "Bar chart" })
      )
    });
  }
  async enter() {
    if (v.clear(":not([slot])"), v.append(this.page), !this.#t.plot) {
      const t = E({
        parent: this.page,
        size: "8rem",
        marginTop: "3rem"
      });
      this.#t.plot = await S(
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
}(), { Exception: T, pop: W } = await use("@/rollo/");
class C extends Map {
  constructor() {
    super();
  }
  async use(o) {
    T.if(!this.has(o), `Invalid key: ${o}.`);
    const e = this.get(o);
    return await e?.promise, e.data;
  }
}
const q = 5, I = await use("@/content/blog/_manifest.json"), k = Object.freeze(I.map(([t, o]) => t.slice(q))), h = new C();
for (const t of k) {
  const o = Promise.withResolvers();
  h.set(t, o);
}
for (const [t, o] of h.entries()) {
  const [e, s] = W(o, "resolve", "reject");
  use(`@/content/blog${t}.json`).then((a) => {
    const { html: r, meta: n } = a, { abstract: c, image: p, title: l } = n;
    o.data = { abstract: c, html: r, image: p, title: l }, e(o.data), delete o.promise, Object.freeze(o);
  }).catch((a) => {
    s(a);
  });
}
const { component: i } = await use("@/rollo/"), _ = ({ path: t, abstract: o, image: e, title: s }) => {
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
}, { component: $ } = await use("@/rollo/"), { NavLink: B } = await use("@/router/"), H = ({ html: t, path: o }) => {
  const e = $.from(t, { convert: !1 });
  for (const s of e.querySelectorAll("img")) {
    const a = s.getAttribute("src");
    a.startsWith("/") && s.replaceWith($.img({ src: `${use.meta.base}${a}` }));
  }
  for (const s of e.querySelectorAll("a[href]")) {
    const a = s.getAttribute("href");
    a.startsWith("/") && (s.parentElement.classList.add("nav"), s.replaceWith(B("nav-link", { path: a, text: s.textContent })));
  }
  return e;
}, { Exception: M, component: u, pop: D, toTop: F } = await use("@/rollo/"), { router: Y } = await use("@/router/"), { Route: Z } = await use("@/router/"), { frame: x } = await use("@/frame/"), G = new class extends Z {
  #t = {};
  constructor() {
    super({ page: u.main("container my-3") }), this.#t.cards = u.div(
      "grid md:grid-cols-2 xl:grid-cols-3 gap-y-3 md:gap-4 xl:gap-5"
    ), this.#t.post = u.div(), this.page.append(this.#t.cards, this.#t.post);
    const t = [...k], o = () => {
      if (!t.length) return;
      const e = t.shift();
      h.use(e).then((s) => {
        const [a, r, n] = D(
          s,
          "abstract",
          "image",
          "title"
        );
        Object.freeze(s);
        const c = _({ path: e, abstract: a, image: r, title: n });
        this.#t.cards.append(c), o();
      }).catch((s) => {
        M.raise(
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
          this.#t.cards.classes.add("hidden");
          const n = `/${r}`;
          h.use(n).then((c) => {
            const { html: p } = c, l = H({ html: p, path: n });
            this.#t.post.detail.root.append(l), F(this.#t.post);
          });
        } else
          this.#t.cards.classes.remove("hidden");
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
          await Y(`${t}${l}`);
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
    x.clear(":not([slot])"), x.append(this.page), this.page.$.view = e.at(0) || null;
  }
  /* Route LC. Runs every time the active route get a sub route (or query), 
  e.g., /notes/foo -> /notes/bar. */
  update(t, o, ...e) {
    this.page.$.view = e.at(0) || null;
  }
}(), { component: J } = await use("@/rollo/"), { Nav: K } = await use("@/router/"), { frame: Q } = await use("@/frame/"), U = K(
  J.nav("nav router flex flex-col gap-y-1 p-1", {
    slot: "side",
    parent: Q
  })
), { component: b } = await use("@/rollo/"), { router: V, Route: X, NavLink: tt } = await use("@/router/"), { frame: m } = await use("@/frame/"), f = "/", et = b.main("container pt-3", b.h1({ text: "Home" }));
function ot() {
  m.clear(":not([slot])"), m.append(this.page);
}
const st = X.create({ enter: ot, page: et, path: f });
V.routes.add(f, st);
tt("nav-link", {
  path: f,
  innerHTML: await use("/favicon.svg"),
  slot: "home",
  parent: m
});
const { component: d } = await use("@/rollo/"), { frame: y } = await use("@/frame/"), at = (t) => {
  const o = d.main(
    "container",
    d.h1({ text: "Page not found" })
  ), e = d.p({ parent: o });
  t ? (t instanceof Error && (t = t.message), e.text = t) : e.clear(), y.clear(":not([slot])"), y.append(o);
}, { capitalize: nt } = await use("@/rollo/"), { NavLink: rt, router: j, Route: it } = await use("@/router/");
for (let [t, o] of Object.entries(
  /* @__PURE__ */ Object.assign({ "./routes/about/index.js": z, "./routes/bar/index.js": P, "./routes/notes/index.js": G })
)) {
  t = `/${t.split("/").at(-2)}`;
  const e = nt(t.slice(1));
  rt("nav-link", {
    text: e,
    path: t,
    title: e,
    parent: U
  }), j.routes.add(t, o);
}
const ct = async () => {
  await j.setup({
    error: at
  });
};
export {
  U as nav,
  ct as setup
};
