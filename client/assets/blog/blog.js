const f = async () => ({
  reboot: await use("@/bootstrap/reboot.css"),
  shadow: await use("@/blog/shadow.css")
}), w = async () => {
  const { component: o } = await use("@/component");
  return ({ path: r, ...s }) => {
    const { abstract: t, image: e, title: a } = s, c = o.div(
      "card",
      {},
      o.img("card-img-top", { src: `${use.meta.base}${e}` }),
      o.div(
        "card-body.nav.d-flex.flex-column",
        {},
        o.a(
          "nav-link",
          o.h1("card-title", { text: a, title: a })
        ),
        o.p("card-text", { text: t })
      ),
      o.div("card-footer")
    );
    return c.attribute.card = r, c;
  };
}, u = /* @__PURE__ */ new Map(), b = async () => {
  const { component: o } = await use("@/component"), { NavLink: r } = await use("@/router/"), s = (t) => {
    for (const e of t.querySelectorAll("img")) {
      const a = e.getAttribute("src");
      if (a.startsWith("/")) {
        const c = e.getAttribute("alt"), l = o.img({
          alt: c,
          src: `${use.meta.base}${a}`
        });
        e.replaceWith(l);
      }
    }
  };
  return ({ html: t, path: e }) => {
    const a = o.div({ innerHTML: t, slot: "post" });
    a.attribute.post = e, s(a);
    for (const c of a.querySelectorAll("a[href]")) {
      const l = c.getAttribute("href");
      l.startsWith("/") && (c.parentElement.classList.add("nav"), c.replaceWith(r("nav-link", { path: l, text: c.textContent })));
    }
    return a;
  };
}, { component: i } = await use("@/component"), { layout: d } = await use("@/layout/"), { ref: h } = await use("@/state"), { router: m } = await use("@/router/"), { toTop: g } = await use("@/tools/scroll"), y = await w(), v = await b(), n = i.main(
  "container mt-3 mb-3",
  i.h1("py-3", { text: "Blog", slot: "title" })
), p = h();
p.effects.add(
  (o, r) => {
    const s = r.owner.previous;
    if (s && u.get(`/${s}`)?.remove(), o) {
      n.attribute.postView = !0;
      const t = `/${o}`;
      u.has(t) || m.error(`Invalid path: ${t}.`);
      const e = u.get(t);
      n.append(e), g(e);
    } else
      n.attribute.postView = !1;
  },
  { run: !1 }
);
async function x(o) {
  n.attribute.page = o, n.attachShadow({ mode: "open" }), await (async () => {
    const t = i.div(
      { id: "root" },
      i.slot({ name: "title" }),
      i.div({ "[cards]": !0 }, i.slot()),
      i.slot({ name: "post" })
    );
    n.detail.shadow = t, n.shadowRoot.append(t);
    const e = await f();
    e.reboot.use(n), e.shadow.use(n);
  })();
  const r = await use("@/content/bundle/blog.json");
  for (let t of r.manifest.map(([e, a]) => e)) {
    const e = r.bundle[t];
    t = `/${t.split("/").at(-1)}`;
    const a = y({ path: t, ...e.meta });
    n.append(a);
    const c = v({ html: e.content, path: t });
    u.set(t, c);
  }
  const s = "a.nav-link";
  n.on.click = async (t) => {
    if (t.target.matches(s) || t.target.closest(s)) {
      const e = t.target.closest("[card]");
      if (e) {
        const a = e.attribute.card;
        await m(`${o}${a}`);
      }
    }
  };
}
function $(o, r, ...s) {
  d.clear(":not([slot])"), d.append(n), p(s.at(0) || null);
}
function k(o, r, ...s) {
  p(s.at(0) || null);
}
function S(o) {
  n.remove();
}
const A = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  enter: $,
  exit: S,
  setup: x,
  update: k
}, Symbol.toStringTag, { value: "Module" }));
export {
  A as blog
};
